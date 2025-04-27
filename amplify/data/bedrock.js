export function request(ctx) {
    const { ingredients = [] } = ctx.args;

    // construct the prompt to send to the model
    const prompt = `Suggest a recipe idea using the following ingrdients: ${ingredients.join(", ")}.`;

    // Return the rquest configuration
    return {
        resourcePath: `/model/anthropic-claude-3-sonnet-202440229-v1:0/invoke`,
        method: "POST",
        params: {
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                anthropic_version: "bedrock-2023-05-31",
                max_tokens: 1000,
                message: [
                    {
                        role: "user",
                        content: [{
                            type: "text",
                            text: `\n\nHuman: ${prompt}\n\nAssistant:`,
                        }]
                    }
                ]
            })
        }
    };

}

export function response(ctx) {
    //Parse the response body
    const parsedBody = JSON.parse(ctx.result.body);

    //Extract the text content from the response 
    const res = {
        body: parsedBody.content[0].text,
    };

    //Return the resp
    return res;
}