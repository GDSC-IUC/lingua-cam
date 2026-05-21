import { Response } from 'express';

interface ApiResponseData {
  success: boolean;
  message?: string;
  data?: unknown;
  error?: { code: string; message: string };
  meta?: { page?: number; limit?: number; total?: number };
}

export const sendSuccess = (
  res: Response,
  data: unknown,
  message = 'Success',
  statusCode = 200,
  meta?: ApiResponseData['meta']
) => {
  const payload: ApiResponseData = { success: true, message, data };
  if (meta) payload.meta = meta;
  return res.status(statusCode).json(payload);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode = 500,
  code = 'INTERNAL_ERROR'
) => {
  const payload: ApiResponseData = {
    success: false,
    error: { code, message },
  };
  return res.status(statusCode).json(payload);
};
