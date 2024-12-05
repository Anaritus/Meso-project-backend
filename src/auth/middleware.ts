import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import BadAuthError from '../errors/bad_auth_error';

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!(authorization && authorization.startsWith('Bearer '))) {
    next(new BadAuthError('Пользователь не авторизован'));
    return;
  }

  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch {
    next(new BadAuthError('Пользователь не авторизован'));
    return;
  }

  req.body.user = payload;
  next();
};
