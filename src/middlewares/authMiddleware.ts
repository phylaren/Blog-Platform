import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: { id: string };
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Немає доступу. Будь ласка, авторизуйтесь' });
      return;
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token as string, process.env.JWT_SECRET as string) as JwtPayload;

    req.user = {
      id: decoded.id as string
    };

    next();
  } catch (error) {
    res.status(401).json({ error: 'Недійсний або прострочений токен' });
  }
};