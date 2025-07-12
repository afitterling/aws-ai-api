import OpenAI from "openai";
import { Resource } from "sst";

export async function handler(event) {
    const ai = new OpenAI({
        apiKey: Resource.OPEN_AI_SECRET.value,
    });

    const { categories } = JSON.parse(event.body);

    const prompt = `
I have the following categories of expenses: ${categories}.
Return 5 money-saving tips as an HTML string.
Each tip should be in a separate <div> element.
Highlight the most relevant category word(s) in each tip using <strong> tags.

Do not explain anything. Do not wrap the HTML in triple backticks or markdown. Only return plain HTML.
`;

    const response = await ai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role: "user",
                content: prompt
            }
        ],
        temperature: 0.7,
    });

    const tipsHtml = response.choices[0].message.content?.trim();

    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipsHtml }),
    };
}
