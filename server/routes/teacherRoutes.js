import express from 'express';
import { teacherController } from '../controllers/index.js';
import { middleware } from '../middleware/index.js';

const router = express.Router();

router.post('/create', teacherController.createTeacher);
router.get('/view-profile', middleware.protect, teacherController.viewMyProfile);
router.get('/view-polls', middleware.protect, teacherController.viewMyPolls);

export default router;