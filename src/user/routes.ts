import { Router } from 'express';
import {
  getUser, getUsers, updateUser, updateUserAvatar,
} from './controllers';
import { updateAvatarMiddleware, updateUserMiddleware } from './middleware';

const router = Router();

router.get('/', getUsers);
router.get('/me', getUser);
router.patch('/me', updateUserMiddleware, updateUser);
router.patch('/me/avatar', updateAvatarMiddleware, updateUserAvatar);

export default router;
