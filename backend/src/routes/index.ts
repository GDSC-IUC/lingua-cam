import { Router } from 'express';
import authRoutes from './auth.routes';
import languageRoutes from './language.routes';
import lessonRoutes from './lesson.routes';
import progressRoutes from './progress.routes';
import dictionaryRoutes from './dictionary.routes';
import voiceRoutes from './voice.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/languages', languageRoutes);
router.use('/lessons', lessonRoutes);
router.use('/progress', progressRoutes);
router.use('/dictionary', dictionaryRoutes);
router.use('/voice', voiceRoutes);

// Health check
router.get('/health', (_req, res) => {
  res.json({ success: true, message: '🇨🇲 Lingua-Cam API is running', version: '1.0.0' });
});

export default router;
