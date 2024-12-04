import { NextFunction } from 'express';
import { MongooseError } from './errors';
import InvalidDataError from './invalid_data_error';
import NotFoundError from './not_found_error';

export default (next: NextFunction) => (err: MongooseError) => {
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return next(new NotFoundError('Запрашиваемый пост не найден'));
  }
  if (err.name === 'ValidationError') {
    return next(new InvalidDataError());
  }
  return next(err);
};
