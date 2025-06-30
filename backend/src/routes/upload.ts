import express from 'express';
import { uploadSingleImage, uploadMultipleImages } from '../controllers/uploadController';
import { authenticateToken, requireAdminOrManager } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = express.Router();

// Protected routes (Admin/Manager only)
router.post('/single', authenticateToken, requireAdminOrManager, upload.single('image'), uploadSingleImage);
router.post('/multiple', authenticateToken, requireAdminOrManager, upload.array('images', 5), uploadMultipleImages);

export default router;
