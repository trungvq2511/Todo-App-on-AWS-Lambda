import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import cors from "@middy/http-cors";
import {createLogger} from '../../logger/LoggerUtils.mjs'
import {addAttachMentLogic} from "../../business-logic/TodoLogic.js";

const logger = createLogger('generate-url')

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
        credentials: true
    })
  )
  .handler(async (event) => {
      console.log('Processing event: ', event)

      const url = await addAttachMentLogic(event);

      logger.info('URL generated', {
          uploadUrl: url
      })

      return {
          statusCode: 200,
          body: JSON.stringify({
              uploadUrl: url
          })
      }
  })