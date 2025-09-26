export function ApiStack({ OPEN_AI_SECRET, cache }) {
    // Create Api
    const prefix = `/identity/identity-pool-budget/${$app.stage}`;

    // Read SSM parameters (outputs resolve to Pulumi outputs)
    const userPoolId = aws.ssm.getParameterOutput({ name: `${prefix}/COGNITO_USER_POOL_ID` }).value;
    const clientId = aws.ssm.getParameterOutput({ name: `${prefix}/COGNITO_CLIENT_ID` }).value;
    const identityPid = aws.ssm.getParameterOutput({ name: `${prefix}/COGNITO_IDENTITY_POOL_ID` }).value;

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

    const authorizer = api.addAuthorizer({
        name: "myCognitoAuthorizer",
        jwt: {
            issuer: $interpolate`https://cognito-idp.${aws.getRegionOutput().name}.amazonaws.com/${userPoolId}`,
            audiences: [clientId]
        }
    });

    const auth = { jwt: { authorizer: authorizer.id } }

    api.route("POST /api/v1/ai/categorize", {
        handler: "api/ai/v1/expenses/categorize20250404.handler",
    }, { auth });

    api.route("POST /api/v1/ai/costsaving1", {
        handler: "api/ai/v1/expenses/costSavings1.handler",
    }, { auth });

    api.route("POST /api/v1/ai/activity/by_mood", {
        handler: "api/ai/v1/activities/findActivityByMood.handler",
    }, { auth });

    api.route("POST /api/v1/budget/savingtips", {
        handler: "api/ai/v1/budget/budgetTipps20250825-001.handler",
        timeout: "180 seconds",
        link: [cache],
    }, { auth });

    api.route("POST /api/v1/food/recepis/prepare", {
        handler: "api/ai/v1/food/receipes/receiptPreferencesStyle.handler",
        timeout: "180 seconds",
        link: [cache],
    }, { auth });

}