import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import cors from "@middy/http-cors";
import {DynamoDBDocument} from "@aws-sdk/lib-dynamodb";
import {DynamoDB} from "@aws-sdk/client-dynamodb";
import {getUserId} from "../utils.mjs";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'
import AWSXRay from 'aws-xray-sdk-core'
import { createLogger } from '../../utils/logger.mjs'
const logger = createLogger('auth')


const dynamoDbXRay = AWSXRay.captureAWSv3Client(new DynamoDB())
const dynamoDbClient = DynamoDBDocument.from(dynamoDbXRay)
const todosTable = process.env.TODOS_TABLE
const attachmentsS3Bucket = process.env.TODO_ATTACHMENTS_S3_BUCKET
const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)
const s3Client = new S3Client();

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
    const imageId = uuidv4();

    const command = new PutObjectCommand({
      Bucket: attachmentsS3Bucket,
      Key: imageId
    })
    const url = await getSignedUrl(s3Client, command, {
      expiresIn: urlExpiration
    })

    await dynamoDbClient.update({
      TableName: todosTable,
      Key: {
        userId,
        todoId
      },
      UpdateExpression: 'set attachmentUrl = :attachmentUrl',
      ExpressionAttributeValues: {
        ':attachmentUrl': `https://${attachmentsS3Bucket}.s3.amazonaws.com/${imageId}`
      },
    })

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