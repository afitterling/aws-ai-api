
export async function handler() {

    return {
        statusCode: 200,
        //headers: DEFAULT_HEADERS,
        body: JSON.stringify(
            { "message": "online" }
        )
    };

}