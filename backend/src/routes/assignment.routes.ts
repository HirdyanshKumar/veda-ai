import { Router } from 'express';
import { 
  createAssignment, 
  getAssignments, 
  getAssignment, 
  getGeneratedPaper,
  deleteAssignment,
  regenerateAssignment,
  downloadPDF,
  getDashboardStats
} from '../controllers/assignment.controller';
import { verifyAuth } from '../middleware/auth.middleware';

const router = Router();

router.use(verifyAuth);

router.get('/stats', getDashboardStats);

router.post('/', createAssignment);
router.post('/:id/regenerate', regenerateAssignment);
router.get('/', getAssignments);
router.get('/:id', getAssignment);
router.get('/:id/paper', getGeneratedPaper);
router.get('/:id/pdf', downloadPDF);
router.delete('/:id', deleteAssignment);

export default router;
