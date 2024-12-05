import { NextFunction, Request, Response } from 'express';
import NotFoundError from '../errors/not_found_error';
import InvalidDataError from '../errors/invalid_data_error';
import errorWrapper from '../errors/error_wrapper';
import { checkUserAuth } from '../user/controllers';
import Card from './model';
import WrongCardError from './errors';

export const getCards = (
  _: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => Card.find({})
  .populate('owner')
  .populate('likes')
  .then((cards) => res.send(cards))
  .catch(next);

export const postCard = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const {
    name,
    link,
    user: { _id },
  } = req.body;
  if (!name || !link) {
    return Promise.reject(new InvalidDataError()).catch(next);
  }
  return checkUserAuth(_id)
    .then((user) => Card.create({ name, link, owner: user._id }))
    .then((card) => card.populate('owner'))
    .then((card) => res.status(201).send(card))
    .catch(errorWrapper(next));
};

export const deleteCard = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { cardId } = req.params;
  return Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Запрашиваемый пост не найден');
      }
      if (card.owner !== req.body.user._id) {
        throw new WrongCardError();
      }
      return Card.findByIdAndDelete(card._id);
    })
    .then(() => res.send({ message: 'Пост удален' }))
    .catch(next);
};

export const likeCard = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { cardId } = req.params;
  const { _id } = req.body.user;
  return checkUserAuth(_id)
    .then((user) => Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: user._id } },
      { new: true },
    ))
    .then((card) => card?.populate('owner'))
    .then((card) => card?.populate('likes'))
    .then((card) => res.send(card))
    .catch(errorWrapper(next));
};

export const dislikeCard = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { cardId } = req.params;
  const { _id } = req.body.user;
  return checkUserAuth(_id)
    .then((user) => Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: user._id } },
      { new: true },
    ))
    .then((card) => card?.populate('owner'))
    .then((card) => card?.populate('likes'))
    .then((card) => res.send(card))
    .catch(errorWrapper(next));
};
