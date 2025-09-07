export function ApiStack({ OPEN_AI_SECRET, cache }) {
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
            link: [OPEN_AI_SECRET, cache],
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

    api.route("POST /api/v1/budget/savingtips", {
        handler: "api/ai/v1/budget/budgetTipps20250825-001.handler",
        timeout: "180 seconds",
        link: [cache],
    });

    api.route("POST /api/v1/food/recepis/prepare", {
        handler: "api/ai/v1/food/receipes/receiptPreferencesStyle.handler",
        timeout: "180 seconds",
        link: [cache],
    });

}