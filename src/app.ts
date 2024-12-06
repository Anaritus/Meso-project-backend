import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import { errors } from 'celebrate';
import { signUserMiddlewarer } from './user/middleware';
import { requestLogger, errorLogger } from './logger/middleware';
import { createUser, login } from './user/controllers';
import { ErrorWithCode } from './errors/errors';
import userRouter from './user/routes';
import cardRouter from './card/routes';
import NotFoundError from './errors/not_found_error';
import auth from './auth/middleware';

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use(helmet());
app.use(requestLogger);

app.post('/signin', signUserMiddlewarer, login);
app.post('/signup', signUserMiddlewarer, createUser);

app.use(auth);
app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use('*', (req: Request, res: Response, next: NextFunction) => {
  throw new NotFoundError('Данной страницы не существует');
});

app.use(errorLogger);
app.use(errors());

app.use(
  (err: ErrorWithCode, req: Request, res: Response, next: NextFunction) => {
    const { statusCode = 500, message } = err;
    res.status(statusCode).send({
      message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
    });
  },
);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
