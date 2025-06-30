import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  getRestaurantInfo,
  updateRestaurantInfo,
  updateRestaurantLogo,
  updateRestaurantBanner
} from '../controllers/restaurantController';

const router = express.Router();

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'restaurant-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Sadece resim dosyaları yüklenebilir'));
    }
  }
});

// Routes
router.get('/', getRestaurantInfo);
router.put('/', updateRestaurantInfo);
router.put('/logo', upload.single('logo'), updateRestaurantLogo);
router.put('/banner', upload.single('banner'), updateRestaurantBanner);

export default router;
