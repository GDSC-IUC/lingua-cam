import { Router } from 'express';
import { getAllLanguages, getLanguageById, getLessonsByLanguage } from '../controllers/language.controller';

const router = Router();

router.get('/', getAllLanguages);
router.get('/:id', getLanguageById);
router.get('/:id/lessons', getLessonsByLanguage);

export default router;
