import express from 'express';
import { pollController } from '../controllers/index.js';
import { middleware } from '../middleware/index.js';

const router = express.Router();

router.post('/create', middleware.protect, pollController.createPoll);

export default router;