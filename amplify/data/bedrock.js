export function request(ctx) {
    console.log("Request context:", JSON.stringify(ctx.args));
    const { ingredients = [] } = ctx.args;

    // construct the prompt to send to the model
    const prompt = `Suggest a recipe idea using the following ingrdients: ${ingredients.join(", ")}.`;
    console.log("Sending prompt:", prompt);

    // Return the request configuration
    return {
        resourcePath: `/model/anthropic.claude-3-sonnet-20240229-v1:0/invoke`,
        method: "POST",
        params: {
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                anthropic_version: "bedrock-2023-05-31",
                max_tokens: 1000,
                messages: [
                    {
                        role: "user",
                        content: [{
                            type: "text",
                            text: prompt ,
                        }]
                    }
                ]
            })
        }
    };

}

export function response(ctx) {
    console.log("Raw response from Bedrock:", ctx.result);

    //Parse the response body
    const parsedBody = JSON.parse(ctx.result.body);

    // Claude 3 response structure
    if (parsedBody && parsedBody.content && Array.isArray(parsedBody.content) && parsedBody.content.length > 0) {
        return {
            body: parsedBody.content[0].text,
            error: ""
        };
    }

    // Return the raw response for debugging
    return {
        body: JSON.stringify(parsedBody),
        error: ""
    };
}