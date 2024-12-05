import { ErrorWithCode } from '../errors/errors';

class WrongCardError extends Error implements ErrorWithCode {
  statusCode = 409;

  constructor(message: string = 'У вас нет прав для данной операции') {
    super(message);
  }
}

export default WrongCardError;
