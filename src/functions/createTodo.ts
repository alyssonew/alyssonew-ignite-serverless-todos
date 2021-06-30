import { document } from "../utils/dynamodbClient";
import { v4 as uuidV4 } from "uuid";

export const handle = async (event) => {

    const { email, title, deadline } = event.body;

    const user = await document.query({
        TableName: "users",
        KeyConditionExpression: "email = :email",
        ExpressionAttributeValues: {
            ":email": email
        }
    }).promise();

    if(!user.Items[0]) throw Error("User doesn't exists");

    await document.put({
        TableName: "users",
        Item: {
            todos: [
                ...user.todos,
                {
                    id: uuidV4(), 
                    title,
                    done: false,
                    deadline: new Date(deadline)
                }
             ]
        }
    }).promise();

    return {
        statusCode: 201,
        body: JSON.stringify({
            message: "Todo created successfully!",
        }),
        headers: {
            "Content-Type": "application/json",
        },
    }
}