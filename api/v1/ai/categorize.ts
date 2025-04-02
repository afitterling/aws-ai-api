import _ from "lodash";
import OpenAI from "openai";
import { Resource } from "sst";



export async function handler(event) {
    const ai = new OpenAI({
        apiKey: Resource.OPEN_AI_SECRET.value,
    } as any);

    const id = event.pathParameters?.id;
    const userId = 1;

    const { note, categories } = JSON.parse(event.body);

    console.log(note);

    const response = await ai.responses.create({
        model: "gpt-4o",
        input: `I have following categories as expense types: ${categories} please identify the category to the expense with note: ${note} and return only one string the category without quotes!`
    });

    return {
        statusCode: 200,
        body: JSON.stringify({ category: response.output_text }),
    };

}

