import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import {DynamoDB} from '@aws-sdk/client-dynamodb'
import {DynamoDBDocument} from '@aws-sdk/lib-dynamodb'
import {getUserId} from "../utils.mjs";

const dynamoDbClient = DynamoDBDocument.from(new DynamoDB())
const dynamoDbDocument = DynamoDBDocument.from(new DynamoDB())
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
      const result = await dynamoDbDocument.query({
          TableName: todosTable,
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
              ':userId': userId
          },
          ScanIndexForward: false
      })
      const todos = result.Items

      return {
          statusCode: 200,
          body: JSON.stringify({
              items: todos
          })
      }
  })
