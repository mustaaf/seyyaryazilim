import express from 'express';
import { 
  getCategories, 
  getCategory, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '../controllers/categoryController';
import { authenticateToken, requireAdminOrManager } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getCategories);
router.get('/:id', getCategory);

// Protected routes (Admin/Manager only)
router.post('/', authenticateToken, requireAdminOrManager, createCategory);
router.put('/:id', authenticateToken, requireAdminOrManager, updateCategory);
router.delete('/:id', authenticateToken, requireAdminOrManager, deleteCategory);

export default router;
