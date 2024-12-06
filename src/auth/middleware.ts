import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import BadAuthError from './errors';

const { JWT_SECRET = 'some-secret-key' } = process.env;

export default (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!(authorization && authorization.startsWith('Bearer '))) {
    next(new BadAuthError('Пользователь не авторизован'));
    return;
  }

  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch {
    next(new BadAuthError('Пользователь не авторизован'));
    return;
  }

  req.body.user = payload;
  next();
};
