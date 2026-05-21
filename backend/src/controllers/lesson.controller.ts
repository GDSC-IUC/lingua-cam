import { Request, Response } from 'express';
import Lesson from '../models/Lesson.model';
import VocabularyItem from '../models/VocabularyItem.model';
import Quiz from '../models/Quiz.model';
import UserProgress from '../models/UserProgress.model';
import User from '../models/User.model';
import { sendSuccess, sendError } from '../utils/ApiResponse';
import asyncHandler from '../utils/asyncHandler';
import { AuthRequest } from '../middleware/auth.middleware';

// GET /lessons/:id
export const getLessonById = asyncHandler(async (req: Request, res: Response) => {
  const lesson = await Lesson.findById(req.params.id);
  if (!lesson || !lesson.isPublished) return sendError(res, 'Leçon introuvable', 404, 'NOT_FOUND');

  const vocabulary = await VocabularyItem.find({ lessonId: lesson._id }).sort({ difficultyLevel: 1 });
  return sendSuccess(res, { ...lesson.toObject(), vocabulary });
});

// GET /lessons/:id/quiz
export const getLessonQuiz = asyncHandler(async (req: Request, res: Response) => {
  const quiz = await Quiz.findOne({ lessonId: req.params.id });
  if (!quiz) return sendError(res, 'Quiz introuvable pour cette leçon', 404, 'NOT_FOUND');
  return sendSuccess(res, quiz);
});

// POST /lessons/:id/complete  (protégé)
export const completeLesson = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { score, timeSpentSeconds } = req.body;
  const lessonId = req.params.id;
  const userId = req.userId!;

  const lesson = await Lesson.findById(lessonId);
  if (!lesson) return sendError(res, 'Leçon introuvable', 404, 'NOT_FOUND');

  const xpEarned = score >= 70 ? lesson.xpReward : Math.floor(lesson.xpReward * (score / 100));

  // Upsert progression
  const progress = await UserProgress.findOneAndUpdate(
    { userId, lessonId },
    {
      $set: { languageId: lesson.languageId, lastAttemptAt: new Date() },
      $max: { score },
      $inc: { attempts: 1 },
      $setOnInsert: { completed: false },
    },
    { upsert: true, new: true }
  );

  const newBadges: string[] = [];

  if (score >= 70 && !progress.completed) {
    progress.completed = true;
    progress.completedAt = new Date();
    progress.xpEarned = xpEarned;
    await progress.save();

    // Ajouter XP à l'user
    await User.findByIdAndUpdate(userId, { $inc: { totalXp: xpEarned } });
  }

  return sendSuccess(res, { xpEarned, score, newBadges, completed: progress.completed });
});
