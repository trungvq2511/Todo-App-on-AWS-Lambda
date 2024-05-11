import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'

const dynamoDbClient = DynamoDBDocument.from(new DynamoDB())

const todosTable = process.env.TODOS_TABLE
// import { createTodo } from '../../businessLogic/todos.mjs'
// import { getUserId } from '../utils.mjs'

const todos = [
    {
        "todoId":"605525c4-d36c-1234-b3ff-65b853344123",
        "userId":"google-oauth2|115783759495544745774",
        "attachmentUrl":"https://serverless-c4-todo-images.s3.amazonaws.com/605525c4-1234-4d23-b3ff-65b853344123",
        "dueDate":"2022-12-12",
        "createdAt":"2022-11-28T22:04:08.613Z",
        "name":"Buy bread",
        "done":false
    }
]

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
        credentials: true
    })
  )
  .handler(async (event) => {
      console.log('Processing event: ', event)

      const scanCommand = {
          TableName: todosTable
      }
      const result = await dynamoDbClient.scan(scanCommand)
      const items = result.Items

      console.log('items', items)
      return {
          statusCode: 200,
          body: JSON.stringify({
              items
          })
      }
  })