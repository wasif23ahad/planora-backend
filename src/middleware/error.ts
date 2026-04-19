import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(public message: string, public statusCode: number = 400) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`[Error] ${err.message}`);

  const statusCode = err.statusCode || (err.name === 'ZodError' ? 422 : 500);
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: {
      code: err.name,
      message,
      details: err.errors || undefined,
    },
  });
};
