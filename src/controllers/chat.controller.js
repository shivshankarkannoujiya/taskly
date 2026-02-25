import { runAgentLoop } from '../agent/ai.js';
import { getAllTodos } from '../agent/tools.js';

const chatWithAgent = async (req, res) => {
    const { message, history = [] } = req.body;

    if (!message || message.trim() === '') {
        return res.status(400).json({
            success: false,
            error: 'Message is required.',
        });
    }

    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'X-Accel-Buffering': 'no',
    });

    const keepAlive = setInterval(() => {
        res.write(':\n\n');
    }, 15000);

    const sendEvent = (event) => {
        res.write(`data: ${JSON.stringify(event)}\n\n`);
    };

    let closed = false;
    req.on('close', () => {
        closed = true;
        clearInterval(keepAlive);
        console.log('Client disconnected');
    });

    try {
        const { updatedHistory } = await runAgentLoop(message, history, (event) => {
            if (!closed) sendEvent(event);
        });

        if (!closed) {
            sendEvent({ type: 'history', data: updatedHistory });
            sendEvent({ type: 'done' });
            res.end();
        }
    } catch (error) {
        console.error('Agent Error', error);
        if (!closed) {
            sendEvent({
                type: 'state',
                data: {
                    state: 'ERROR',
                    message: 'Agent crashed. Try again.',
                },
            });
            sendEvent({ type: 'done' });
            res.end();
        }
    }
};

const getTodos = async (_, res) => {
    try {
        const todos = await getAllTodos();
        return res.status(200).json({ success: true, todos });
    } catch (error) {
        console.error('Todos Error', err);
        res.status(500).json({ error: 'Failed to fetch todos.' });
    }
};

export { chatWithAgent, getTodos };
