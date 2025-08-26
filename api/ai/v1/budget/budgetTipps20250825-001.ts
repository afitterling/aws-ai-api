import OpenAI from "openai";
import { Resource } from "sst";
import { translate } from "../../../../utils/i18n";
import { readUserContent, upsertUserContent } from "../../../../services/db/ops/upsertCache";

const ai = new OpenAI({ apiKey: Resource.OPEN_AI_SECRET.value });
const userId = "FAKE_USER_XYZ";

export async function handler(event) {
    const { expenses } = JSON.parse(event.body);

    const qs = new URLSearchParams(event.rawQueryString || "");
    const numStr = qs.get("num");
    const spendings = qs.get("spendings");

    const num =
        numStr !== null && Number.isFinite(Number(numStr)) ? Number(numStr) : 5;
    const tips_range = num;

    const spendings_considered = spendings !== null && Number.isFinite(Number(spendings)) ? Number(spendings) : 100;
    console.log(spendings_considered);

    // check cache
    const cached = await readUserContent(userId);

    if (cached) {
        const updatedAt = new Date(cached.updatedAt).getTime();
        const now = Date.now();
        const eightHours = 8 * 60 * 60 * 1000;

        if (now - updatedAt < eightHours) {
            console.log("Cache hit:", cached);
            return {
                statusCode: 200,
                body: JSON.stringify(cached),
            };
        }
    }

    const expenses_ = (Array.isArray(expenses) ? expenses : [])
        .map((expense) => ({
            amount: expense.value ?? expense.amount,
            category: expense.category,
            date: expense.date,
            desc: expense.desc,
            currency: expense.currency || "EUR",
        }))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, spendings_considered);

    //const temperature = 1.0;

    const response = await ai.responses.create({
        model: "gpt-4o",
        //temperature,
        input: [
            {
                role: "system",
                content: `
You are an assistant that generates money-saving tips.

Goal: Analyze expenses by category and description and provide up to ${tips_range} actionable tips and psychological behvaior changes.
Each tip should be realistic, concise (max 1 sentences), and help the user save money.
      `.trim(),
            },
            {
                role: "user",
                content: `please analyse these expenses: ${expenses_
                    .map((e) => `${e.amount} ${e.currency} on '${translate("en", "CATEGORIES." + e.category)}' ${e.desc ? `named ${e.desc}` : ""} at ${e.date}`)
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
                            minItems: tips_range,
                            maxItems: tips_range
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
            .slice(0, tips_range);
    }

    // Final cleanup: trim, dedupe, cap to 5
    const clean = Array.from(new Set(tips.map((t) => t.trim())))
        .map((t) => t.replace(/\s+/g, " "))
        .slice(0, tips_range);


    // write cache
    await upsertUserContent({
        userId: userId,
        type: "budget_tips",
        content: JSON.stringify({ tips: clean }),
    });

    return {
        statusCode: 200,
        body: JSON.stringify({ tips: clean }),
    };

}