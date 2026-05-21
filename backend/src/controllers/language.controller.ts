import { Request, Response } from 'express';
import Language from '../models/Language.model';
import Lesson from '../models/Lesson.model';
import { sendSuccess, sendError } from '../utils/ApiResponse';
import asyncHandler from '../utils/asyncHandler';

// GET /languages
export const getAllLanguages = asyncHandler(async (_req: Request, res: Response) => {
  const languages = await Language.find({ isActive: true }).sort({ order: 1 });
  // Enrichir avec le nombre de leçons
  const withCount = await Promise.all(
    languages.map(async (lang) => {
      const lessonCount = await Lesson.countDocuments({ languageId: lang._id, isPublished: true });
      return { ...lang.toObject(), lessonCount };
    })
  );
  return sendSuccess(res, withCount);
});

// GET /languages/:id
export const getLanguageById = asyncHandler(async (req: Request, res: Response) => {
  const language = await Language.findById(req.params.id);
  if (!language) return sendError(res, 'Langue introuvable', 404, 'NOT_FOUND');
  return sendSuccess(res, language);
});

// GET /languages/:id/lessons
export const getLessonsByLanguage = asyncHandler(async (req: Request, res: Response) => {
  const { level, page = '1', limit = '20' } = req.query;
  const filter: Record<string, unknown> = { languageId: req.params.id, isPublished: true };
  if (level) filter.level = level;

  const pageN = parseInt(page as string, 10);
  const limitN = parseInt(limit as string, 10);
  const skip = (pageN - 1) * limitN;

  const [lessons, total] = await Promise.all([
    Lesson.find(filter).sort({ order: 1 }).skip(skip).limit(limitN),
    Lesson.countDocuments(filter),
  ]);

  return sendSuccess(res, lessons, 'OK', 200, { page: pageN, limit: limitN, total });
});
