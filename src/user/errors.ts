import { ErrorWithCode } from '../errors/errors';

export default class DuplicateUserError extends Error implements ErrorWithCode {
  statusCode = 409;

  constructor(message: string = 'Пользователь с данным email уже существует') {
    super(message);
  }
}
