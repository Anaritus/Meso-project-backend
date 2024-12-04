import { ErrorWithCode } from './errors';

export default class NotFoundError extends Error implements ErrorWithCode {
  statusCode = 404;
}
