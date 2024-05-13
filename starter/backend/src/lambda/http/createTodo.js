import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { createLogger } from '../../utils/logger.mjs'
import {createTodoLogic} from '../../businessLogic/todoLogic.js'

const logger = createLogger('create-todo')
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

    const todo = await createTodoLogic(event);

    logger.info('Todo created', {
      todo: todo
    })

    return {
      statusCode: 201,
      body: JSON.stringify({
        item: todo
      })
    }
  })

