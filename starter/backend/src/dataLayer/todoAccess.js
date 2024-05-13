import AWSXRay from "aws-xray-sdk-core";
import {DynamoDB} from "@aws-sdk/client-dynamodb";
import {DynamoDBDocument} from "@aws-sdk/lib-dynamodb";

const dynamoDbXRay = AWSXRay.captureAWSv3Client(new DynamoDB())
const dynamoDbClient = DynamoDBDocument.from(dynamoDbXRay)

const todosTable = process.env.TODOS_TABLE
const todosIndex = process.env.TODOS_CREATED_AT_INDEX

export async function getTodoAccess(userId) {
    return await dynamoDbClient.query({
        TableName: todosTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
        },
        //sort by LocalSecondaryIndexes desc = false
        IndexName: todosIndex,
        ScanIndexForward: false
    })
}

export async function createTodoAccess(todo) {
    await dynamoDbClient.put({
        TableName: todosTable,
        Item: todo
    })
}

export async function updateTodoAccess(userId, todoId, updatedTodo) {
    await dynamoDbClient.update({
        TableName: todosTable,
        Key: {
            userId,
            todoId
        },
        UpdateExpression: 'set done = :done',
        ExpressionAttributeValues: {
            ':done': updatedTodo.done
        },
    })
}

export async function deleteTodoAccess(userId, todoId) {
    await dynamoDbClient.delete({
        TableName: todosTable,
        Key: {
            userId,
            todoId
        }
    })
}