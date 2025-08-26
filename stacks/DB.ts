export function CacheTable() {

    const userContent = new sst.aws.Dynamo("CacheTable", {
        fields: {
            userId: "string",     // partition key
/*             type: "string",       // classification
            content: "string",    // text content
            createdAt: "string",  // ISO timestamp of creation
            updatedAt: "string",  // ISO timestamp of last update
 */        },
        primaryIndex: {
            hashKey: "userId",
        },
    });

    return userContent;

};