import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import cors from "@middy/http-cors";
import {createLogger} from '../../logger/LoggerUtils.mjs'
import {deleteTodoLogic} from "../../business-logic/TodoLogic.js";

const logger = createLogger('delete-todo')

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
        credentials: true
    })
  )
  .handler(async (event) => {
      console.log('Processing event: ', event)

      const todoId = await deleteTodoLogic(event);

      logger.info('Todo deleted', {
          todoId: todoId
      })

      return {
          statusCode: 200,
          body: 'Delete todo successfully'
      }
  })
