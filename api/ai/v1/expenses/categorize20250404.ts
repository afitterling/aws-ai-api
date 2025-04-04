import _ from "lodash";
import OpenAI from "openai";
import { Resource } from "sst";

/*

response = client.responses.create(
    model="gpt-4o-2024-08-06",
    input=[
        {"role": "system", "content": "Extract the event information."},
        {"role": "user", "content": "Alice and Bob are going to a science fair on Friday."}
    ],
    text={
        "format": {
            "type": "json_schema",
            "name": "calendar_event",
            "schema": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string"
                    },
                    "date": {
                        "type": "string"
                    },
                    "participants": {
                        "type": "array", 
                        "items": {
                            "type": "string"
                        }
                    },
                },
                "required": ["name", "date", "participants"],
                "additionalProperties": False
            },
            "strict": True
        }
    }
)

event = json.loads(response.output_text)
*/

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
        input: [
            { "role": "system", "content": `I have following categories of expenses: ${categories} please choose one for the following user input` },
            { "role": "user", "content": note }
        ],
        text: {
            "format": {
                "type": "json_schema",
                "name": "expense_category",
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
        body: JSON.stringify({ response: { category: JSON.parse(response.output_text) } }),
    };

}

