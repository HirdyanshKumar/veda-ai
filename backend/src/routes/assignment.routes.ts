import { Router } from 'express';
import { 
  createAssignment, 
  getAssignments, 
  getAssignment, 
  getGeneratedPaper,
  deleteAssignment
} from '../controllers/assignment.controller';

const router = Router();

// Routes
router.post('/', createAssignment);
router.get('/', getAssignments);
router.get('/:id', getAssignment);
router.get('/:id/paper', getGeneratedPaper);
router.delete('/:id', deleteAssignment);

export default router;
