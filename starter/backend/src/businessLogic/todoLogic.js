import {createTodoAccess} from "../dataLayer/todoAccess.js"
import {getUserId} from "../lambda/utils.mjs";
import {v4 as uuidv4} from "uuid";
import dateFormat from 'dateformat';

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

const getDatetime = () => {
    return dateFormat(new Date(), 'dd/mm/yyyy HH:MM:ss')
}