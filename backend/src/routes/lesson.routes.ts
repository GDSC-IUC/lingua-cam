import { Router } from 'express';
import { getLessonById, getLessonQuiz, completeLesson } from '../controllers/lesson.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.get('/:id', getLessonById);
router.get('/:id/quiz', getLessonQuiz);
router.post('/:id/complete', protect, completeLesson);

export default router;
