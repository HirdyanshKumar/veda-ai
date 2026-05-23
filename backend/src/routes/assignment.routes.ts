import { Router } from 'express';
import { 
  createAssignment, 
  getAssignments, 
  getAssignment, 
  getGeneratedPaper,
  deleteAssignment,
  regenerateAssignment
} from '../controllers/assignment.controller';
import { verifyAuth } from '../middleware/auth.middleware';

const router = Router();

router.use(verifyAuth);

router.post('/', createAssignment);
router.post('/:id/regenerate', regenerateAssignment);
router.get('/', getAssignments);
router.get('/:id', getAssignment);
router.get('/:id/paper', getGeneratedPaper);
router.delete('/:id', deleteAssignment);

export default router;
