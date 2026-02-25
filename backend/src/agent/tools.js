import { db } from '../db/index.js';
import { todosTable } from '../db/schema.js';
import { ilike, eq } from 'drizzle-orm';

export const getAllTodos = async () => {
    const todos = await db.select().from(todosTable);
    return todos;
};

export const createTodo = async (todo) => {
    const [result] = await db
        .insert(todosTable)
        .values({
            todo,
        })
        .returning({
            id: todosTable.id,
        });
    return result.id;
};

export const searchTodo = async (search) => {
    const query = search?.trim();
    if (!query) return [];

    return await db
        .select()
        .from(todosTable)
        .where(ilike(todosTable.todo, `%${query}%`));
};

export const deleteTodoById = async (id) => {
    await db.delete(todosTable).where(eq(todosTable.id, id));
};

export const tools = {
    getAllTodos,
    createTodo,
    searchTodo,
    deleteTodoById,
};
