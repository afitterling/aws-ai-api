import OpenAI from "openai";
import { Resource } from "sst";

export async function handler(event) {
    const ai = new OpenAI({
        apiKey: Resource.OPEN_AI_SECRET.value,
    });

    const { categories } = JSON.parse(event.body);
    console.log(categories);

    const prompt = `
I have the following categories over time keys are years and subkeys are months of expenses summed up in categories: ${categories}.
Return 4-5 personalized money-saving tips as an HTML string.
Each tip should be in a separate <div> element.
Highlight the most relevant category word(s) in each tip using <strong> tags.

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
