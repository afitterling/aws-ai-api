
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