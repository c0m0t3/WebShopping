import { Request, Response, NextFunction } from 'express';
import { validate as isUUID } from 'uuid';

export function validateUUID(req: Request, res: Response, next: NextFunction): void {
  const { id } = req.params;

  if (!isUUID(id)) {
    res.status(400).send({ error: 'Invalid UUID' });
    return;
  }

  next();
}