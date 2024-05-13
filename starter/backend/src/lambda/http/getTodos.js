import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import {DynamoDB} from '@aws-sdk/client-dynamodb'
import {DynamoDBDocument} from '@aws-sdk/lib-dynamodb'
import {getUserId} from "../utils.mjs";
import AWSXRay from 'aws-xray-sdk-core'

const dynamoDbXRay = AWSXRay.captureAWSv3Client(new DynamoDB())
const dynamoDbClient = DynamoDBDocument.from(dynamoDbXRay)
const todosTable = process.env.TODOS_TABLE
const todosIndex = process.env.TODOS_CREATED_AT_INDEX

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
      const result = await dynamoDbClient.query({
          TableName: todosTable,
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
              ':userId': userId
          },
          //sort by LocalSecondaryIndexes desc (false)
          IndexName: todosIndex,
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
