import { Router } from 'express';
import { chatWithAgent, getTodos } from '../controllers/chat.controller.js';

const router = Router();

router.route('/chat').post(chatWithAgent);
router.route('/todos').get(getTodos);

export default router;
