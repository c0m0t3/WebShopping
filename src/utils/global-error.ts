import { NextFunction, Request, Response } from 'express';

export function globalErrorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) : void {
  console.error("Uncaught error", err);

  // Default error response
  res.status(500).json({
    errors: ['Internal Server Error'],
  });
}