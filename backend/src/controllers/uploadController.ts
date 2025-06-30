import { Request, Response } from 'express';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

// @desc    Upload single image
// @route   POST /api/upload/single
// @access  Private (Admin/Manager)
export const uploadSingleImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Dosya bulunamadı' });
    }

    const file = req.file;
    const outputPath = path.join('uploads', `optimized-${file.filename}`);

    // Optimize image with Sharp
    await sharp(file.path)
      .resize(800, 600, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .jpeg({ quality: 85 })
      .toFile(outputPath);

    // Delete original file
    fs.unlinkSync(file.path);

    res.json({
      success: true,
      message: 'Resim başarıyla yüklendi',
      data: {
        filename: `optimized-${file.filename}`,
        url: `/uploads/optimized-${file.filename}`,
        originalName: file.originalname,
        size: fs.statSync(outputPath).size
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Dosya yükleme hatası', error: error.message });
  }
};

// @desc    Upload multiple images
// @route   POST /api/upload/multiple
// @access  Private (Admin/Manager)
export const uploadMultipleImages = async (req: Request, res: Response) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({ message: 'Dosya bulunamadı' });
    }

    const files = req.files as Express.Multer.File[];
    const uploadedFiles = [];

    for (const file of files) {
      const outputPath = path.join('uploads', `optimized-${file.filename}`);

      // Optimize image with Sharp
      await sharp(file.path)
        .resize(800, 600, { 
          fit: 'inside',
          withoutEnlargement: true 
        })
        .jpeg({ quality: 85 })
        .toFile(outputPath);

      // Delete original file
      fs.unlinkSync(file.path);

      uploadedFiles.push({
        filename: `optimized-${file.filename}`,
        url: `/uploads/optimized-${file.filename}`,
        originalName: file.originalname,
        size: fs.statSync(outputPath).size
      });
    }

    res.json({
      success: true,
      message: `${uploadedFiles.length} resim başarıyla yüklendi`,
      count: uploadedFiles.length,
      data: uploadedFiles
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Dosya yükleme hatası', error: error.message });
  }
};

// @desc    Delete uploaded image
// @route   DELETE /api/upload/:filename
// @access  Private (Admin/Manager)
export const deleteImage = async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;
    const filePath = path.join('uploads', filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Dosya bulunamadı' });
    }

    // Delete file
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      message: 'Dosya başarıyla silindi'
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Dosya silme hatası', error: error.message });
  }
};
