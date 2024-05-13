import {getTodoAccess, createTodoAccess, updateTodoAccess, deleteTodoAccess} from "../dataLayer/todoAccess.js"
import {getUserId} from "../lambda/utils.mjs";
import {v4 as uuidv4} from "uuid";
import dateFormat from 'dateformat';

export async function getTodoLogic(event) {
    const userId = getUserId(event)
    const result = await getTodoAccess(userId);

    return result.Items
}

export async function createTodoLogic(event) {
    const userId = getUserId(event)
    const itemId = uuidv4()
    const parsedBody = JSON.parse(event.body)
    const todo = {
        userId: userId,
        todoId: itemId,
        ...parsedBody,
        createdAt: getDatetime(),
        done: false
    }

    await createTodoAccess(todo);

    return todo;
}

export async function updateTodoLogic(event) {
    const userId = getUserId(event)
    const todoId = event.pathParameters.todoId
    const updatedTodo = JSON.parse(event.body)

    await updateTodoAccess(userId, todoId, updatedTodo);

    return {
        todoId: todoId,
        done: updatedTodo.done
    };
}

export async function deleteTodoLogic(event) {
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)

    await deleteTodoAccess(userId, todoId);

    return todoId;
}

const getDatetime = () => {
    return dateFormat(new Date(), 'dd/mm/yyyy HH:MM:ss')
}