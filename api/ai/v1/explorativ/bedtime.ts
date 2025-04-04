import _ from "lodash";
import OpenAI from "openai";
import { Resource } from "sst";

const ai = new OpenAI({
    apiKey: Resource.OPEN_AI_SECRET.value,
} as any);


export async function handler(event) {
    const id = event.pathParameters?.id;
    const userId = 1;
    //console.log(id, userId);

    const response = await ai.responses.create({
        //model: "gpt-4o",
        model: "o3-mini",
        input: "Write a one-sentence bedtime story about a unicorn.",
    });

    return {
        statusCode: 200,
        body: JSON.stringify({ text: response.output_text }),
    };

}

