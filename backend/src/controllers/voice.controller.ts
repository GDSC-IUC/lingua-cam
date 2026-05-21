import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import { sendSuccess } from '../utils/ApiResponse';
import fs from 'fs';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Simple Levenshtein distance for string similarity
const getSimilarityScore = (str1: string, str2: string): number => {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();
  
  if (s1 === s2) return 100;
  if (s1.length === 0 || s2.length === 0) return 0;

  const matrix = [];
  for (let i = 0; i <= s2.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= s1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= s2.length; i++) {
    for (let j = 1; j <= s1.length; j++) {
      if (s2.charAt(i - 1) === s1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1 // deletion
          )
        );
      }
    }
  }

  const distance = matrix[s2.length][s1.length];
  const maxLength = Math.max(s1.length, s2.length);
  return Math.round(((maxLength - distance) / maxLength) * 100);
};

export const scoreVoice = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Fichier audio manquant');
  }

  const { targetText } = req.body;
  if (!targetText) {
    // Delete file if error
    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(400);
    throw new Error('Texte cible manquant');
  }

  try {
    // Transcription with OpenAI Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(req.file.path),
      model: 'whisper-1',
    });

    // Cleanup audio file
    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

    const spokenText = transcription.text;
    const score = getSimilarityScore(spokenText, targetText);

    sendSuccess(res, { score, spokenText, targetText }, 'Évaluation vocale réussie');
  } catch (error: any) {
    // Cleanup on error
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Erreur IA Vocale:', error);
    res.status(500);
    throw new Error("Erreur lors de l'évaluation de la voix via l'IA");
  }
});
