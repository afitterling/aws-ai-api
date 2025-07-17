import OpenAI from "openai";
import { Resource } from "sst";

export async function handler(event) {
    const ai = new OpenAI({
        apiKey: Resource.OPEN_AI_SECRET.value,
    });

    const { categories, expenses } = JSON.parse(event.body);
    console.log(categories);

    const prompt = `
I have the following categories expenses of current month: ${categories} and
I have the following past single expenses: ${expenses}
Return 5 personalized money-saving tips as an HTML string enumber them with 1-5.
Each tip should be in a separate <div> element and start with a number.
Highlight the most relevant meaning in each tip using <strong> tags.
Do not explain anything. Do not wrap the HTML in triple backticks or markdown. Only return plain HTML.
`;

    const response = await ai.responses.create({
        model: "gpt-4o",
        input: [
            {
                role: "user",
                content: prompt
            }
        ],
        text: {
            "format": {
                "type": "text",
            }
        }

    });

    console.log(response);

    const tipsHtml = response.output_text;

    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipsHtml }),
    };
}
