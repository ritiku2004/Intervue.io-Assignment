import express from 'express';
import { authController } from '../controllers/index.js';

const router = express.Router();

router.post('/login', authController.loginTeacher);

export default router;