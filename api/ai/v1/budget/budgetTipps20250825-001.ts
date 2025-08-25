import OpenAI from "openai";
import { Resource } from "sst";

const ai = new OpenAI({ apiKey: Resource.OPEN_AI_SECRET.value });

export async function handler(event) {
    const { expenses } = JSON.parse(event.body);

    const expenses_ = (Array.isArray(expenses) ? expenses : [])
        .map((expense) => ({
            amount: expense.value ?? expense.amount,
            category: expense.category,
            date: expense.date,
            currency: expense.currency || "EUR",
        }))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 100);

    const temperature = 1.0;
    const max_tips = 5;

    const response = await ai.responses.create({
        model: "gpt-5",
        //temperature,
        input: [
            {
                role: "system",
                content: `
You are an assistant that generates money-saving tips.

Goal: Analyze expenses and provide up to 5 actionable tips.
Each tip should be realistic, concise (max 2 sentences), and help the user save money.
      `.trim(),
            },
            {
                role: "user",
                content: `Expenses: ${expenses_
                    .map((e) => `${e.amount} ${e.currency} on ${e.category} at ${e.date}`)
                    .join(", ")}`,
            },

        ],
        text: {
            format: {
                type: "json_schema",
                name: "money_saving_tips",
                schema: {
                    type: "object",
                    properties: {
                        tips: {
                            type: "array",
                            items: { type: "string" },
                            minItems: 5,
                            maxItems: 5
                        }
                    },
                    required: ["tips"],
                    additionalProperties: false
                },
                strict: true
            }
        }
    });

    let tips: string[] = [];

    try {
        const parsed = JSON.parse(response.output_text);
        const arr = parsed?.tips;
        if (Array.isArray(arr)) {
            tips = arr;
        } else {
            throw new Error("`tips` is not an array");
        }
    } catch {
        // Fallback: split plain text into lines (just in case)
        tips = String(response.output_text || "")
            .split(/\r?\n/)
            .map((s) => s.replace(/^\s*[-*•]\s*/, "").trim())
            .filter(Boolean)
            .slice(0, 5);
    }

    // Final cleanup: trim, dedupe, cap to 5
    const clean = Array.from(new Set(tips.map((t) => t.trim())))
        .map((t) => t.replace(/\s+/g, " "))
        .slice(0, 5);

    return {
        statusCode: 200,
        body: JSON.stringify({ tips: clean }),
    };

}