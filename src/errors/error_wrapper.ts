import { NextFunction } from 'express';
import { MongooseError } from './errors';
import InvalidDataError from './invalid_data_error';

export default (next: NextFunction) => (err: MongooseError) => {
  if (err.name === 'CastError' || err.name === 'ValidationError') {
    return next(new InvalidDataError());
  }
  return next(err);
};
