import { Request, Response } from 'express';
import VocabularyItem from '../models/VocabularyItem.model';
import { sendSuccess } from '../utils/ApiResponse';
import asyncHandler from '../utils/asyncHandler';

// GET /dictionary?lang=ewondo&q=mbolo
export const searchDictionary = asyncHandler(async (req: Request, res: Response) => {
  const { lang, q, page = '1', limit = '20' } = req.query;
  const pageN = parseInt(page as string, 10);
  const limitN = parseInt(limit as string, 10);

  const filter: Record<string, unknown> = {};

  if (lang) {
    // Trouver languageId via le code
    const Language = (await import('../models/Language.model')).default;
    const language = await Language.findOne({ code: lang });
    if (language) filter.languageId = language._id;
  }

  if (q) {
    filter.$text = { $search: q as string };
  }

  const [items, total] = await Promise.all([
    VocabularyItem.find(filter)
      .populate('languageId', 'name code color')
      .skip((pageN - 1) * limitN)
      .limit(limitN)
      .sort({ word: 1 }),
    VocabularyItem.countDocuments(filter),
  ]);

  return sendSuccess(res, items, 'OK', 200, { page: pageN, limit: limitN, total });
});
