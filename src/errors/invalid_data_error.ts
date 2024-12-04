import { ErrorWithCode } from './errors';

export default class InvalidDataError extends Error implements ErrorWithCode {
  statusCode = 400;

  constructor(message: string = 'Введены некорректные данные') {
    super(message);
  }
}
