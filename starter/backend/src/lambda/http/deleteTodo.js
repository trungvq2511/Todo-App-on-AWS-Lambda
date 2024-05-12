import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import cors from "@middy/http-cors";
import {getUserId} from "../utils.mjs";
import {DynamoDBDocument} from "@aws-sdk/lib-dynamodb";
import {DynamoDB} from "@aws-sdk/client-dynamodb";

const dynamoDbClient = DynamoDBDocument.from(new DynamoDB())
const todosTable = process.env.TODOS_TABLE

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    console.log('Processing event: ', event)

    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)

    console.log('todoId', todoId)

    await dynamoDbClient.delete({
      TableName: todosTable,
      Key: {
        userId,
        todoId
      }
    })

    return {
      statusCode: 200,
      body: 'Delete todo successfully'
    }
  })
