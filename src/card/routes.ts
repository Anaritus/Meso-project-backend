import { Router } from 'express';
import {
  getCards,
  postCard,
  deleteCard,
  likeCard,
  dislikeCard,
} from './controllers';

const router = Router();
router.get('/', getCards);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);
router.post('/', postCard);

export default router;
