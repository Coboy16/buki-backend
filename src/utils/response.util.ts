import { Response } from 'express';
import { ApiResponse } from '../types';

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = 200
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    data,
  };

  if (message) {
    response.message = message;
  }

  return res.status(statusCode).json(response);
};

export const sendCreated = <T>(
  res: Response,
  data: T,
  message?: string
): Response => {
  return sendSuccess(res, data, message, 201);
};

export const sendNoContent = (res: Response): Response => {
  return res.status(204).send();
};

export const sendError = (
  res: Response,
  message: string,
  code: string = 'ERROR',
  statusCode: number = 500,
  details?: Record<string, unknown>
): Response => {
  const response: ApiResponse<null> = {
    success: false,
    error: {
      message,
      code,
      ...(details && { details }),
    },
  };

  return res.status(statusCode).json(response);
};
