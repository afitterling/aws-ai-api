export const userContent = new sst.aws.Dynamo("UserContentTable", {
    fields: {
        userId: "string",     // partition key
        type: "string",       // classification
        content: "string",    // text content
        createdAt: "string",  // ISO timestamp of creation
        updatedAt: "string",  // ISO timestamp of last update
    },
    primaryIndex: {
        hashKey: "userId",
    },
});
