import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { AppError } from './error.js';

export const validate = (schema: AnyZodObject) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    
    // Assign parsed data back to req to ensure transformed values are used
    req.body = parsed.body;
    if (parsed.query) req.query = parsed.query as any;
    if (parsed.params) req.params = parsed.params as any;

    next();
  } catch (error) {

    if (error instanceof ZodError) {
      const details = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return next(new AppError('Validation failed', 400));
    }
    next(error);
  }
};
