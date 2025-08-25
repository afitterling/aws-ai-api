import OpenAI from "openai";
import { Resource } from "sst";

const ai = new OpenAI({
    apiKey: Resource.OPEN_AI_SECRET.value,
});

export async function handler(event) {

    //console.log(event.body);  //const { expenses } = JSON.parse(event.body);
    //console.log(categories);
    const { expenses } = JSON.parse(event.body);

    const expenses_ = expenses.map(expense => ({
        amount: expense.value,
        category: expense.category,
        date: expense.date,
        currency: expense.currency || 'EUR'
    })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 50);

    //console.log(expenses_);
    console.log(`analyzing ${expenses_.map(e => `${e.amount} ${e.currency} on ${e.category} at ${e.date}`).join(', ')} expenses`);

    const response = await ai.chat.completions.create({
        model: "gpt-5-mini",
        messages: [
            {
                role: "system",
                content: `
You are an assistant that generates new content, not completions.

Goal: Help the user save money on their past n expenses for future.
Context: The user expenses are provided as list each spending categorized with amount
Analyse them. Generate insights, tips, or summaries that encourage cost savings based on this context.
      `
            },
            {
                role: "user",
                content: `${expenses_.map(e => `${e.amount} ${e.currency} on ${e.category} at ${e.date}`).join(', ')}`
            }
        ],
        temperature: 0.7, // creative but relevant
    });

    console.log(response);
    const reply = response.choices[0].message.content;
    console.log(reply);

    //const tipsHtml = response.output_text;

    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply }),
    };
}

/* 
const now = new Date().toISOString();

await dynamo.put({
  TableName: userContent.name,
  Item: {
    userId: "alex-123",
    type: "note",
    content: "My first entry",
    createdAt: now,
    updatedAt: now,
  },
});

// later, on update
await dynamo.update({
  TableName: userContent.name,
  Key: { userId: "alex-123" },
  UpdateExpression: "SET content = :c, updatedAt = :u",
  ExpressionAttributeValues: {
    ":c": "My updated entry",
    ":u": new Date().toISOString(),
  },
}); */