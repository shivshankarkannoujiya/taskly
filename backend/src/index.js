import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(
    cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    }),
);

import chatRouter from './routes/chat.route.js';

app.use('/api/v1', chatRouter);

app.listen(PORT, () => {
    console.log(`Serving at http://localhost:${PORT}`);
});
