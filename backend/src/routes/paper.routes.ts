import { Router } from 'express';
import { 
  updateQuestion,
  addQuestion,
  deleteQuestion
} from '../controllers/assignment.controller';
import { verifyAuth } from '../middleware/auth.middleware';

const router = Router();

router.use(verifyAuth);

router.patch('/:paperId/question', updateQuestion);
router.post('/:paperId/question', addQuestion);
router.delete('/:paperId/question', deleteQuestion);

export default router;
