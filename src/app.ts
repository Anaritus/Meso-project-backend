import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import { ErrorWithCode } from './errors/errors';
import userRouter from './user/routes';
import cardRouter from './card/routes';
import NotFoundError from './errors/not_found_error';

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use(helmet());

app.use((req: Request, res: Response, next: NextFunction) => {
  req.body.user = {
    _id: '674e4102ec4687c9d0f2cc7a',
  };

  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use('*', (req: Request, res: Response, next: NextFunction) => {
  throw new NotFoundError('Данной страницы не существует');
});

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
