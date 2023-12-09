import { NextFunction, Request, Response } from 'express';
import { AppError } from './App-Error';

interface ErrorType extends Error {
  statusCode: number;
  isOperational: boolean;
  message: string;
  status: string;
  stack?: string;
  errors?: any;
  path?: string;
  value?: string;
  code?: number;
  errmsg?: string;
}

export const errorHandler = (
  err: ErrorType,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // handling mongoose errors
  if (err.name == 'validationError') err = handleValidationError(err);
  if (err.name == 'CastError') err = handleCastError(err);
  if (err.code === 11000) err = handleDuplicateFieldsDB(err);
  if (err.name === 'JsonWebTokenError')
    err = new AppError('Invalid token. Please log in again', 401);

  console.log('ERROR 🚨', err);

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

const handleValidationError = (err: ErrorType) => {
  let errors = Object.values(err.errors).map((el: any) => el.message);
  const errorMessage = errors.join(', ');
  return new AppError(errorMessage, 400);
};

const handleCastError = (err: ErrorType) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: ErrorType) => {
  const value = err.errmsg?.match(/(["'])(\\?.)*?\1/);
  const message = `Duplicate field value: ${value}. Please use another value`;
  return new AppError(message, 400);
};
