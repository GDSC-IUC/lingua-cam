import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/ApiResponse';

export const errorHandler = (
  err: Error & { statusCode?: number; code?: string },
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('❌ Error:', err.message);

  // Mongoose duplicate key
  if ((err as any).code === 11000) {
    sendError(res, 'Cette valeur existe déjà', 409, 'DUPLICATE_KEY');
    return;
  }
  // Mongoose validation
  if (err.name === 'ValidationError') {
    sendError(res, err.message, 400, 'VALIDATION_ERROR');
    return;
  }
  // JWT
  if (err.name === 'JsonWebTokenError') {
    sendError(res, 'Token invalide', 401, 'INVALID_TOKEN');
    return;
  }

  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';
  sendError(res, err.message || 'Erreur serveur', statusCode, code);
};
