import { NextFunction, Request, Response } from 'express';
import InvalidDataError from '../errors/invalid_data_error';
import NotFoundError from '../errors/not_found_error';
import errorWrapper from '../errors/error_wrapper';
import User from './model';

export const getUsers = (
  _: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => User.find({})
  .then((users) => res.send({ data: users }))
  .catch(next);

export const checkUserAuth = (_id: string): Promise<any> => User.findById(_id).then((user) => {
  if (!user) {
    throw new NotFoundError('Запрашиваемый пользователь не найден');
  }
  return Promise.resolve(user);
});

export const getUserById = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => checkUserAuth(req.params.userId)
  .then((user) => res.send(user))
  .catch(next);

export const createUser = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { name, about, avatar } = req.body;
  if (!name || !about || !avatar) {
    return Promise.reject(new InvalidDataError()).catch(next);
  }
  return User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch(next);
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
