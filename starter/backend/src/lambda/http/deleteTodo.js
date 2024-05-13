import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import cors from "@middy/http-cors";
import {getUserId} from "../utils.mjs";
import {DynamoDBDocument} from "@aws-sdk/lib-dynamodb";
import {DynamoDB} from "@aws-sdk/client-dynamodb";
import AWSXRay from 'aws-xray-sdk-core'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('delete-todo')
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

    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)

    await dynamoDbClient.delete({
      TableName: todosTable,
      Key: {
        userId,
        todoId
      }
    })

    logger.info('Todo deleted', {
      todoId: todoId
    })

    return {
      statusCode: 200,
      body: 'Delete todo successfully'
    }
  })
