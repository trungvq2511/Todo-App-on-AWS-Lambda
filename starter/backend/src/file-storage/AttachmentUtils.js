import {getSignedUrl} from '@aws-sdk/s3-request-presigner'
import {PutObjectCommand, S3Client} from '@aws-sdk/client-s3'

const attachmentsS3Bucket = process.env.TODO_ATTACHMENTS_S3_BUCKET
const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)
const s3Client = new S3Client();

export async function addAttachmentToS3(imageId) {
    const command = new PutObjectCommand({
        Bucket: attachmentsS3Bucket,
        Key: imageId
    })
    return await getSignedUrl(s3Client, command, {
        expiresIn: urlExpiration
    })
}