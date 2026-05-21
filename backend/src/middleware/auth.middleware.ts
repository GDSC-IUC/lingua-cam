import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt';
import { sendError } from '../utils/ApiResponse';

export interface AuthRequest extends Request {
  userId?: string;
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendError(res, 'Token manquant ou invalide', 401, 'UNAUTHORIZED');
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, jwtConfig.accessSecret) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch {
    sendError(res, 'Token expiré ou invalide', 401, 'TOKEN_EXPIRED');
  }
};
