import { DbUser } from '../../validation/validation';
import { JwtToken } from '../../utils/jwt';

declare global {
  namespace Express {
    interface Request {
      user?: DbUser;
      token?: JwtToken;
    }
  }
}