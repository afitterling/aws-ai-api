export function ApiStack({ OPEN_AI_SECRET }) {
    // Create Api

    const api = new sst.aws.ApiGatewayV2("MyApi",
        {

            cors: {
/*                 allowMethods: ["GET", "POST", "PUT", "DELETE"],
                allowHeaders: ["Content-Type", "Authorization"],
                allowOrigins: [
                    "http://localhost:5173",
                ],
 */            },
            link: [OPEN_AI_SECRET],
        }
    );

    api.route("POST /api/v1/ai/categorize", {
        handler: "api/ai/v1/expenses/categorize20250404.handler",
    });

    api.route("POST /api/v1/ai/costsaving1", {
        handler: "api/ai/v1/expenses/costSavings1.handler",
    });

    api.route("POST /api/v1/ai/activity/by_mood", {
        handler: "api/ai/v1/activities/findActivityByMood.handler",
    });

}