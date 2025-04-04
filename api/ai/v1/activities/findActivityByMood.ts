import _ from "lodash";
import OpenAI from "openai";
import { Resource } from "sst";

export async function handler(event) {
    const ai = new OpenAI({
        apiKey: Resource.OPEN_AI_SECRET.value,
    } as any);

    const id = event.pathParameters?.id;
    const userId = 1;

    try {
        const { activities, constraints, feelings } = JSON.parse(event.body);

        const response = await ai.responses.create({
            model: "gpt-4o",
            input: [
                { "role": "system", "content": `Following activities are available ${activities}. Please return one back to the user based on his mood input. BUT in the answer include these contraints for given activities: ${constraints.join(",")}` },
                { "role": "user", "content": `I feel ${feelings.join(", ")}` }
            ],
            text: {
                "format": {
                    "type": "json_schema",
                    "name": "activity",
                    "schema": {
                        "type": "object",
                        "properties": {
                            "name": {
                                "type": "string"
                            },
                        },
                        "required": ["name"],
                        "additionalProperties": false
                    },
                    "strict": true
                }
            }

        });
        console.log(JSON.stringify(response, null, 2));

        console.log(response);

        return {
            statusCode: 200,
            body: JSON.stringify({ response: { activity: JSON.parse(response.output_text) } }),
        };
    } catch (e) {
        return {
            statusCode: 403,
            body: JSON.stringify({ response: "" }),
        };
    }
}

