import { celebrate, Joi } from 'celebrate';

export const updateUserMiddleware = celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string().required().max(30).min(2),
      about: Joi.string().required().max(200).min(2),
    })
    .unknown(true),
});

export const updateAvatarMiddleware = celebrate({
  body: Joi.object()
    .keys({
      avatar: Joi.string().required(),
    })
    .unknown(true),
});

export const signUserMiddlewarer = celebrate({
  body: Joi.object()
    .keys({
      email: Joi.string().required().email(),
      password: Joi.string(),
    })
    .unknown(true),
});
