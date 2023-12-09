import { Request, Response, NextFunction } from 'express';
import { AppError } from '../Errors/App-Error';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: Decoded;
    }
  }
}

interface Decoded {
  id: string;
  email: string;
  exp: number;
  iat: number;
}

function protectRoute(req: Request, res: Response, next: NextFunction) {
  if (!req.cookies.jwt)
    return next(new AppError('Please login to continue', 401));
  const token = req.cookies.jwt;
  const decoded = jwt.verify(token, process.env.JWT_KEY!) as Decoded;
  req.user = decoded;
  next();
}

export { protectRoute };
