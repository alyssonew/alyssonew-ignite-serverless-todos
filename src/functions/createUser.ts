import { document } from "../utils/dynamoDBClient";
import  { v4 as uuid } from "uuid"
import { toString } from "lodash";

export const handle = async (event)  =>{
 
  const { email } = event.body;
 
  const userAlreadyExists = await document.query({
    TableName: "users",
    KeyConditionExpression: "email = :email",
    ExpressionAttributeValues: {
        ":email": email
    }
}).promise();

  if (userAlreadyExists.Items[0]) throw Error("This user already exists");

  await document.put({
    TableName: "users",
    Item: {
      id: toString(uuid()),
      email,
      todos: []
    }
  }).promise()

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "User created"
    }),
    headers: {
      "Content-Type": "application/json",
    }
  }
}