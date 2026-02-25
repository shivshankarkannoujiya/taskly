import { db } from './db/index.js';
import { todosTable } from './db/schema.js';
import { ilike, eq } from 'drizzle-orm';
import { SYSTEM_PROMPT } from './system_prompt.js';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import readlineSync from 'readline-sync';

dotenv.config();

const AI = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const getAllTodos = async () => {
    const todos = await db.select().from(todosTable);
    return todos;
};

const createTodo = async (todo) => {
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

const searchTodo = async (search) => {
    const query = search?.trim();
    if (!query) return [];

    return await db
        .select()
        .from(todosTable)
        .where(ilike(todosTable.todo, `%${query}%`));
};

const deleteTodoById = async (id) => {
    await db.delete(todosTable).where(eq(todosTable.id, id));
};

const tools = {
    getAllTodos,
    createTodo,
    searchTodo,
    deleteTodoById,
};

const messages = [{ role: 'system', content: SYSTEM_PROMPT }];

while (true) {
    const query = readlineSync.question('Ask: ');
    const userMessage = {
        type: 'user',
        user: query,
    };

    messages.push({ role: 'user', content: JSON.stringify(userMessage) });

    while (true) {
        const response = await AI.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: messages,
            response_format: { type: 'json_object' },
        });

        const result = response.choices[0].message.content;

        messages.push({ role: 'assistant', content: result });

        const action = JSON.parse(result);

        if (action.state === 'OUTPUT' || action.state === 'ERROR') {
            console.log(`\nAI: ${action.message}`);
            if (action.data) {
                console.log('Data:', JSON.stringify(action.data, null, 2));
            }
            break;
        } else if (action.state === 'ACTION') {
            const fn = tools[action.tool];

            if (!fn) {
                throw new Error(`Invalid tool call: "${action.tool}"`);
            }

            const toolArgs = Object.values(action.args ?? {});

            const observation = await fn(...toolArgs);

            const observationMessage = {
                type: 'observation',
                observation:
                    observation ?? 'Action completed successfully with no return value.',
            };

            messages.push({
                role: 'user',
                content: JSON.stringify(observationMessage),
            });
        }
    }
}
