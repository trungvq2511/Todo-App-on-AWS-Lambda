import AWSXRay from "aws-xray-sdk-core";
import {DynamoDB} from "@aws-sdk/client-dynamodb";
import {DynamoDBDocument} from "@aws-sdk/lib-dynamodb";

const dynamoDbXRay = AWSXRay.captureAWSv3Client(new DynamoDB())
const dynamoDbClient = DynamoDBDocument.from(dynamoDbXRay)

const todosTable = process.env.TODOS_TABLE

export async function createTodoAccess(todo) {
    await dynamoDbClient.put({
        TableName: todosTable,
        Item: todo
    })
}