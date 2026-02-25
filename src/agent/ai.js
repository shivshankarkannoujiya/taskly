import OpenAI from 'openai';
import { tools } from './tools.js';
import { SYSTEM_PROMPT } from '../system_prompt.js';

const AI = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const runAgentLoop = async (userMessage, history = [], onEvent) => {
    const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...history,
        {
            role: 'user',
            content: JSON.stringify({ type: 'user', user: userMessage }),
        },
    ];

    let output = null;

    while (true) {
        const response = await AI.chat.completions.create({
            model: 'gpt-4o-mini',
            messages,
            response_format: { type: 'json_object' },
        });

        const result = response.choices[0].message.content;
        messages.push({ role: 'assistant', content: result });

        const action = JSON.parse(result);

        onEvent({ type: 'state', data: action });

        if (action.state === 'OUTPUT' || action.state === 'ERROR') {
            output = action;
            onEvent({ type: 'done' });
            break;
        }

        if (action.state === 'ACTION') {
            const fn = tools[action.tool];

            if (!fn) {
                const errEvent = {
                    type: 'state',
                    data: {
                        state: 'ERROR',
                        message: `Unknown tool "${action.tool}" was requested.`,
                        data: null,
                    },
                };
                onEvent(errEvent);
                onEvent({ type: 'done' });
                break;
            }

            const toolArgs = Object.values(action.args ?? {});
            const observation = await fn(...toolArgs);

            const observationMessage = {
                type: 'observation',
                observation: observation ?? 'Action completed with no return value.',
            };

            onEvent({ type: 'observation', data: observationMessage });

            messages.push({
                role: 'user',
                content: JSON.stringify(observationMessage),
            });
        }
    }

    const updatedHistory = messages.slice(1);
    return { updatedHistory, output };
};
