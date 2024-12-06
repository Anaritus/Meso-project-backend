import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import InvalidDataError from '../errors/invalid_data_error';
import NotFoundError from '../errors/not_found_error';
import errorWrapper from '../errors/error_wrapper';
import User from './model';

const { JWT_SECRET = 'some-secret-key' } = process.env;

export const getUsers = (
  _: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => User.find({})
  .then((users) => res.send(users))
  .catch(next);

export const checkUserAuth = (_id: string): Promise<any> => User.findById(_id).then((user) => {
  if (!user) {
    throw new NotFoundError('Запрашиваемый пользователь не найден');
  }
  return Promise.resolve(user);
});

export const login = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { email, password } = req.body;
  return User.checkAuth(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: '7d',
      });

      res.send({ token });
    })
    .catch(next);
};

export const getUser = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => checkUserAuth(req.body.user._id)
  .then((user) => res.send(user))
  .catch(next);

export const createUser = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  return bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.send(user.toJSON({ useProjection: true })))
    .catch(errorWrapper(next));
};

export const updateUser = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const {
    name,
    about,
    user: { _id },
  } = req.body;
  if (!name || !about) {
    return Promise.reject(new InvalidDataError()).catch(next);
  }
  return checkUserAuth(_id)
    .then((user) => User.findByIdAndUpdate(
      user._id,
      { name, about },
      {
        new: true,
        runValidators: true,
      },
    ))
    .then((updatedUser) => res.send(updatedUser))
    .catch(errorWrapper(next));
};

export const updateUserAvatar = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const {
    avatar,
    user: { _id },
  } = req.body;
  if (!avatar) {
    return Promise.reject(new InvalidDataError()).catch(next);
  }
  return checkUserAuth(_id)
    .then((user) => User.findByIdAndUpdate(
      user._id,
      { avatar },
      {
        new: true,
        runValidators: true,
      },
    ))
    .then((updatedUser) => res.send(updatedUser))
    .catch(errorWrapper(next));
};
