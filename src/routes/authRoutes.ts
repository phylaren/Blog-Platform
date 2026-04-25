import { Router } from 'express';
import { register, login, getMe, getUsers } from '../controllers/authController';
import { protect } from '../middlewares/authMiddleware';

import {validate} from '../middlewares/validateMiddleware';
import { registerSchema, loginSchema } from '../schemas/authSchema';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

router.get('/me', protect, getMe);
router.get('/users', protect, getUsers);

export default router;


