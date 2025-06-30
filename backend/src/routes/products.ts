import express from 'express';
import { 
  getProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getProductsByCategory,
  updateProductImages
} from '../controllers/productController';
import { authenticateToken, requireAdminOrManager } from '../middleware/auth';
import { uploadProductImages } from '../middleware/multer';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/category/:categoryId', getProductsByCategory);
router.get('/:id', getProduct);

// Protected routes (Admin/Manager only)
router.post('/', authenticateToken, requireAdminOrManager, createProduct);
router.put('/:id', authenticateToken, requireAdminOrManager, updateProduct);
router.put('/:id/images', authenticateToken, requireAdminOrManager, uploadProductImages, updateProductImages);
router.delete('/:id', authenticateToken, requireAdminOrManager, deleteProduct);

export default router;
