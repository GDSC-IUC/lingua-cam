import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/User.model';
import { jwtConfig } from '../config/jwt';
import { sendSuccess, sendError } from '../utils/ApiResponse';
import asyncHandler from '../utils/asyncHandler';
import { AuthRequest } from '../middleware/auth.middleware';

const generateTokens = (userId: string) => {
  const accessToken = jwt.sign({ userId }, jwtConfig.accessSecret, {
    expiresIn: jwtConfig.accessExpires as any,
  });
  const refreshToken = jwt.sign({ userId }, jwtConfig.refreshSecret, {
    expiresIn: jwtConfig.refreshExpires as any,
  });
  return { accessToken, refreshToken };
};

// POST /auth/register
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username || !password) {
    return sendError(res, 'Username et mot de passe requis', 400, 'MISSING_FIELDS');
  }

  const existing = await User.findOne({ $or: [{ username }, { email }] });
  if (existing) {
    return sendError(res, 'Username ou email déjà utilisé', 409, 'DUPLICATE');
  }

  const user = await User.create({ username, email, passwordHash: password });
  const { accessToken, refreshToken } = generateTokens(user._id.toString());

  const refreshHash = await bcrypt.hash(refreshToken, 10);
  user.refreshTokenHash = refreshHash;
  await user.save({ validateBeforeSave: false });

  return sendSuccess(
    res,
    { user: { _id: user._id, username: user.username, email: user.email, level: user.level }, accessToken, refreshToken },
    'Compte créé avec succès',
    201
  );
});

// POST /auth/login
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return sendError(res, 'Email et mot de passe requis', 400, 'MISSING_FIELDS');
  }

  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user || !(await user.comparePassword(password))) {
    return sendError(res, 'Email ou mot de passe incorrect', 401, 'INVALID_CREDENTIALS');
  }

  const { accessToken, refreshToken } = generateTokens(user._id.toString());
  user.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
  await user.save({ validateBeforeSave: false });

  return sendSuccess(res, {
    user: { _id: user._id, username: user.username, email: user.email, totalXp: user.totalXp, level: user.level, streak: user.streak },
    accessToken,
    refreshToken,
  });
});

// POST /auth/guest
export const loginAsGuest = asyncHandler(async (_req: Request, res: Response) => {
  const guestUsername = `guest_${uuidv4().substring(0, 8)}`;
  const user = await User.create({ username: guestUsername, isGuest: true });
  const { accessToken } = generateTokens(user._id.toString());

  return sendSuccess(res, { guestId: user._id, username: guestUsername, accessToken }, 'Connexion invité', 200);
});

// POST /auth/refresh
export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken: token } = req.body;
  if (!token) return sendError(res, 'Refresh token manquant', 400, 'MISSING_TOKEN');

  let decoded: { userId: string };
  try {
    decoded = jwt.verify(token, jwtConfig.refreshSecret) as { userId: string };
  } catch {
    return sendError(res, 'Refresh token invalide ou expiré', 401, 'INVALID_REFRESH_TOKEN');
  }

  const user = await User.findById(decoded.userId).select('+refreshTokenHash');
  if (!user || !user.refreshTokenHash) return sendError(res, 'Utilisateur introuvable', 401, 'USER_NOT_FOUND');

  const isValid = await bcrypt.compare(token, user.refreshTokenHash);
  if (!isValid) return sendError(res, 'Refresh token invalide', 401, 'INVALID_REFRESH_TOKEN');

  const { accessToken, refreshToken: newRefresh } = generateTokens(user._id.toString());
  user.refreshTokenHash = await bcrypt.hash(newRefresh, 10);
  await user.save({ validateBeforeSave: false });

  return sendSuccess(res, { accessToken, refreshToken: newRefresh });
});

// POST /auth/logout
export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (req.userId) {
    await User.findByIdAndUpdate(req.userId, { refreshTokenHash: null });
  }
  return sendSuccess(res, null, 'Déconnecté avec succès');
});

// GET /auth/me
export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.userId);
  if (!user) return sendError(res, 'Utilisateur introuvable', 404, 'NOT_FOUND');
  return sendSuccess(res, user);
});
