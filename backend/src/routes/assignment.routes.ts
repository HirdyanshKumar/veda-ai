import { Router } from 'express';
import { 
  createAssignment, 
  getAssignments, 
  getAssignment, 
  getGeneratedPaper,
  deleteAssignment
} from '../controllers/assignment.controller';
import { verifyAuth } from '../middleware/auth.middleware';

const router = Router();

// Secure all assignment endpoints
router.use(verifyAuth);

// Routes
router.post('/', createAssignment);
router.get('/', getAssignments);
router.get('/:id', getAssignment);
router.get('/:id/paper', getGeneratedPaper);
router.delete('/:id', deleteAssignment);

export default router;
