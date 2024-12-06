import { ErrorWithCode } from '../errors/errors';

export default class BadAuthError extends Error implements ErrorWithCode {
  statusCode = 401;

  constructor(message: string = 'Неправильные почта или пароль') {
    super(message);
  }
}
