import {
    DynamoDBClient,
    UpdateItemCommand,
    UpdateItemCommandOutput,
} from "@aws-sdk/client-dynamodb";

import { Resource } from "sst"; // SST v3 runtime binding

export const db = new DynamoDBClient({});

type UpsertInput = {
    userId: string;          // PK
    type: string;            // classification (becomes an attribute; see note below)
    content: string;         // text body
};

export async function upsertUserContent(input: UpsertInput) {
    const { userId, type, content } = input;
    const now = new Date().toISOString();

    const out: UpdateItemCommandOutput = await db.send(
        new UpdateItemCommand({
            TableName: Resource.CacheTable.name, // from your sst.aws.Dynamo
            Key: { userId: { S: userId } },            // single-key table

            // Upsert: create if missing, update if exists
            UpdateExpression: `
        SET
          #type = :type,
          #content = :content,
          #createdAt = if_not_exists(#createdAt, :now),
          #updatedAt = :now
      `,
            ExpressionAttributeNames: {
                // "type" is a DynamoDB reserved word → must alias
                "#type": "type",
                "#content": "content",
                "#createdAt": "createdAt",
                "#updatedAt": "updatedAt",
            },
            ExpressionAttributeValues: {
                ":type": { S: type },
                ":content": { S: content },
                ":now": { S: now },
            },
            ReturnValues: "ALL_NEW",
        })
    );

    return out.Attributes; // low-level AttributeValue map
}

import { GetItemCommand } from "@aws-sdk/client-dynamodb";

type ReadOutput = {
    userId: string;
    type?: string;
    content?: string;
    createdAt?: string;
    updatedAt?: string;
} | null;

export async function readUserContent(userId: string): Promise<ReadOutput> {
    const out = await db.send(
        new GetItemCommand({
            TableName: Resource.CacheTable.name,
            Key: { userId: { S: userId } },     // single-key table
            // Optional: limit returned fields (alias reserved word "type")
            ProjectionExpression: "#type, #content, #createdAt, #updatedAt",
            ExpressionAttributeNames: {
                "#type": "type",
                "#content": "content",
                "#createdAt": "createdAt",
                "#updatedAt": "updatedAt",
            },
            ConsistentRead: true,
        })
    );

    if (!out.Item) return null;

    return {
        userId,
        type: out.Item.type?.S,
        content: out.Item.content?.S,
        createdAt: out.Item.createdAt?.S,
        updatedAt: out.Item.updatedAt?.S,
    };
}
