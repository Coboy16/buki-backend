import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.util';
import { sendError } from '../utils/response.util';
import { env } from '../config/env';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  if (env.nodeEnv === 'development') {
    console.error('Error:', err);
  }

  if (err instanceof AppError) {
    return sendError(
      res,
      err.message,
      err.code,
      err.statusCode,
      err.details
    );
  }

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    const validationError = err as { errors?: Array<{ message: string; path: string }> };
    const details = validationError.errors?.reduce((acc, e) => {
      acc[e.path] = e.message;
      return acc;
    }, {} as Record<string, string>);

    return sendError(
      res,
      'Validation error',
      'VALIDATION_ERROR',
      400,
      details
    );
  }

  // Sequelize unique constraint errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    const constraintError = err as { errors?: Array<{ path: string }> };
    const field = constraintError.errors?.[0]?.path ?? 'field';
    return sendError(
      res,
      `A record with this ${field} already exists`,
      'DUPLICATE_ENTRY',
      409
    );
  }

  // Sequelize foreign key constraint errors
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return sendError(
      res,
      'Referenced record does not exist',
      'FOREIGN_KEY_ERROR',
      400
    );
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 'Invalid token', 'INVALID_TOKEN', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return sendError(res, 'Token has expired', 'TOKEN_EXPIRED', 401);
  }

  // Default error
  const message = env.nodeEnv === 'development'
    ? err.message
    : 'Internal server error';

  return sendError(res, message, 'INTERNAL_ERROR', 500);
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  return sendError(
    res,
    `Route ${req.method} ${req.path} not found`,
    'NOT_FOUND',
    404
  );
};
