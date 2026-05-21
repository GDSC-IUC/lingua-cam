import { Response } from 'express';
import UserProgress from '../models/UserProgress.model';
import User from '../models/User.model';
import { sendSuccess, sendError } from '../utils/ApiResponse';
import asyncHandler from '../utils/asyncHandler';
import { AuthRequest } from '../middleware/auth.middleware';

// GET /progress/me
export const getMyProgress = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const user = await User.findById(userId);
  if (!user) return sendError(res, 'Utilisateur introuvable', 404, 'NOT_FOUND');

  const progressList = await UserProgress.find({ userId, completed: true })
    .populate('lessonId', 'title theme')
    .populate('languageId', 'name code color');

  // Grouper par langue
  const byLanguage: Record<string, { languageId: unknown; completedLessons: number; xp: number }> = {};
  for (const p of progressList) {
    const langKey = p.languageId.toString();
    if (!byLanguage[langKey]) {
      byLanguage[langKey] = { languageId: p.languageId, completedLessons: 0, xp: 0 };
    }
    byLanguage[langKey].completedLessons++;
    byLanguage[langKey].xp += p.xpEarned;
  }

  return sendSuccess(res, {
    totalXp: user.totalXp,
    streak: user.streak,
    level: user.level,
    completedLessons: progressList.length,
    byLanguage: Object.values(byLanguage),
  });
});

// GET /progress/me/language/:id
export const getProgressByLanguage = asyncHandler(async (req: AuthRequest, res: Response) => {
  const progressList = await UserProgress.find({ userId: req.userId, languageId: req.params.id })
    .populate('lessonId', 'title theme order level');

  return sendSuccess(res, progressList);
});

// POST /progress/streak
export const updateStreak = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.userId);
  if (!user) return sendError(res, 'Utilisateur introuvable', 404, 'NOT_FOUND');

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lastDate = user.lastStreakDate ? new Date(user.lastStreakDate) : null;
  if (lastDate) lastDate.setHours(0, 0, 0, 0);

  const diffDays = lastDate ? Math.floor((today.getTime() - lastDate.getTime()) / 86400000) : null;

  if (!lastDate || diffDays === null) {
    user.streak = 1;
  } else if (diffDays === 1) {
    user.streak += 1;
  } else if (diffDays > 1) {
    user.streak = 1;
  }
  // diffDays === 0 → même jour, ne pas changer

  user.lastStreakDate = today;
  await user.save({ validateBeforeSave: false });

  return sendSuccess(res, { streak: user.streak });
});
