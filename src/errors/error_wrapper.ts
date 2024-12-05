import { NextFunction } from 'express';
import { MongooseError } from './errors';
import InvalidDataError from './invalid_data_error';
import DuplicateUserError from '../user/errors';

export default (next: NextFunction) => (err: MongooseError) => {
  if (err.code === 11000) {
    return next(new DuplicateUserError());
  }
  if (err.name === 'CastError' || err.name === 'ValidationError') {
    return next(new InvalidDataError());
  }
  return next(err);
};
