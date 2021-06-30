import { document } from "../utils/dynamodbClient";


export const handle = async (event) => {

    const { email } = event.body;

    const user = await document.query({
        TableName: "users",
        KeyConditionExpression: "email = :email",
        ExpressionAttributeValues: {
            ":email": email
        }
    }).promise();

    if(!user.Items[0]) throw Error("User doesn't exists");
    return {
        statusCode: 201,
        body: JSON.stringify({
            todos: user.todos,
        }),
        headers: {
            "Content-Type": "application/json",
        },
    }
}