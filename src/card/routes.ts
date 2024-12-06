import { Router } from 'express';
import {
  getCards,
  postCard,
  deleteCard,
  likeCard,
  dislikeCard,
} from './controllers';
import { cardBody, cardMiddleware } from './middleware';

const router = Router();
router.get('/', getCards);
router.delete('/:cardId', cardMiddleware, deleteCard);
router.put('/:cardId/likes', cardMiddleware, likeCard);
router.delete('/:cardId/likes', cardMiddleware, dislikeCard);
router.post('/', cardBody, postCard);

export default router;
