import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import {getTodoLogic} from '../../business-logic/TodoLogic.js'

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
        credentials: true
    })
  )
  .handler(async (event) => {
      console.log('Processing event: ', event)

      const todos = await getTodoLogic(event);

      return {
          statusCode: 200,
          body: JSON.stringify({
              items: todos
          })
      }
  })
