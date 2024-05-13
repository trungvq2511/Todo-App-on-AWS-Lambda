import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import cors from "@middy/http-cors";
import {DynamoDBDocument} from "@aws-sdk/lib-dynamodb";
import {DynamoDB} from "@aws-sdk/client-dynamodb";
import {getUserId} from "../utils.mjs";
import AWSXRay from 'aws-xray-sdk-core'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('update-todo')
const dynamoDbXRay = AWSXRay.captureAWSv3Client(new DynamoDB())
const dynamoDbClient = DynamoDBDocument.from(dynamoDbXRay)
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

    const userId = getUserId(event)
    const todoId = event.pathParameters.todoId
    const updatedTodo = JSON.parse(event.body)

    await dynamoDbClient.update({
      TableName: todosTable,
      Key: {
        userId,
        todoId
      },
      UpdateExpression: 'set done = :done',
      ExpressionAttributeValues: {
        ':done': updatedTodo.done
      },
    })

    logger.info('Todo updated', {
      todoId: todoId,
      done: updatedTodo.done,
    })

    return {
      statusCode: 200,
      body: 'Update todo successfully'
    }
  })
