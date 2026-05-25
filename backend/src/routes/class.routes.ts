import { Router } from 'express';
import { verifyAuth } from '../middleware/auth.middleware';
import {
  createClass,
  getClasses,
  getClass,
  updateClass,
  deleteClass,
  regenerateJoinCode
} from '../controllers/class.controller';

const router = Router();

router.use(verifyAuth);

router.post('/', createClass);
router.get('/', getClasses);
router.get('/:id', getClass);
router.patch('/:id', updateClass);
router.delete('/:id', deleteClass);
router.patch('/:id/regenerate-code', regenerateJoinCode);

export default router;
