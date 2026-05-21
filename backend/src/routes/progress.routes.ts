import { Router } from 'express';
import { getMyProgress, getProgressByLanguage, updateStreak } from '../controllers/progress.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.use(protect); // toutes les routes progress sont protégées
router.get('/me', getMyProgress);
router.get('/me/language/:id', getProgressByLanguage);
router.post('/streak', updateStreak);

export default router;
