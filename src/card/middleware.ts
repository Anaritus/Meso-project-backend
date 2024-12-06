import { celebrate, Joi } from 'celebrate';
import urlRegExp from '../util';

export const cardMiddleware = celebrate({
  params: Joi.object()
    .keys({
      cardId: Joi.string().alphanum().length(24),
    })
    .unknown(true),
});

export const cardBody = celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().pattern(urlRegExp),
    })
    .unknown(true),
});
