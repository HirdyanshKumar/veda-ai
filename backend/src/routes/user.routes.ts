import { Router } from 'express';
import { onboardUser } from '../controllers/user.controller';
import { verifyAuth } from '../middleware/auth.middleware';

const router = Router();

router.post('/onboard', verifyAuth, onboardUser);

export default router;
