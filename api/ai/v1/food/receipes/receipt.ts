import OpenAI from "openai";
import { Resource } from "sst";
import { readUserContent, upsertUserContent } from "../../../../../services/db/ops/upsertCache";

const ai = new OpenAI({ apiKey: Resource.OPEN_AI_SECRET.value });
const userId = "FAKE_USER_XYZ";

export async function handler(event) {
    const { ingredients } = JSON.parse(event.body);

    const qs = new URLSearchParams(event.rawQueryString || "");
    //const numStr = qs.get("num");
    const spendings = qs.get("spendings");
    const timecached = qs.get("timecached");
    const cacheseg = qs.get("cacheseg");

    /*     const num =
            numStr !== null && Number.isFinite(Number(numStr)) ? Number(numStr) : 5;
        const tips_range = num;
     */

    //const spendings_considered = spendings !== null && Number.isFinite(Number(spendings)) ? Number(spendings) : 100;

    const outdated = timecached !== null && Number.isFinite(Number(timecached)) ? Number(timecached) * 1000 /*sec*/ : 60 * 1000 * 60;

    const cachesegment = cacheseg ? "#" + cacheseg : "";

    const key = userId + cachesegment;
    const cached = await readUserContent(key);

    console.log("cache outdated", { userId, outdated, cachesegment, key });

    // check cache

    if (cached) {
        const updatedAt = new Date(cached.updatedAt).getTime();
        const now = Date.now();

        if (now - updatedAt < outdated) {
            console.log("Cache hit:", cached);
            return {
                statusCode: 200,
                body: JSON.stringify(JSON.parse(cached.content)),
            };
        }
    }

    const dayparttime = "lunch";

    //const temperature = 1.0;

    const response = await ai.responses.create({
        model: "gpt-4o",
        //temperature,
        input: [
            {
                role: "system",
                content: `
You wanna create cheap lunches with ingredients given by the user

Goal: take into account ingredients create actionable recipes for ${dayparttime}
help the user save money and eat healthy
      `.trim(),
            },
            {
                role: "user",
                content: `please give me a recipe using these ingredients: ${ingredients.map((e) => `${e.name} `).join(", ")}`
            },

        ],
        text: {
            format: {
                type: "json_schema",
                name: "lunch_recipe",
                schema: {
                    type: "object",
                    properties: {
                        title: {
                            type: "string"
                        },
                        description: {
                            type: "string"
                        },
                        steps: {
                            type: "array",
                            items: { type: "string" },
                            minItems: 1
                        }
                    },
                    required: ["title", "description", "steps"],
                    additionalProperties: false
                },
                strict: true
            }
        }
    });

    let recipe = {};

    try {
        const parsed = JSON.parse(response.output_text);

        console.log("parsed", parsed);
        //console.log("title", parsed?.title);
        //console.log("description", parsed?.description);

        const { title, description, steps } = parsed;

        recipe = { title, description, steps };

        console.log("recipe", recipe);

    } catch {
        // Fallback: split plain text into lines (just in case)
    }

    // Final cleanup: trim, dedupe, cap to 5
    //const clean = Array.from(new Set(tips.map((t) => t.trim())))
    //.map((t) => t.replace(/\s+/g, " "))
    //.slice(0, 5);


    // write cache
    await upsertUserContent({
        userId: key,
        type: "budget_tips",
        content: JSON.stringify({ recipe }),
    });

    console.log("Cache updated:", { key, recipe });

    return {
        statusCode: 200,
        body: JSON.stringify({ recipe }),
    };

}