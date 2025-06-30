import { Request, Response } from 'express';
import Category from '../models/Category';
import { asyncHandler } from '../utils/asyncHandler';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ sortOrder: 1, createdAt: 1 });

    res.json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
export const getCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Kategori bulunamadı' });
    }

    res.json({
      success: true,
      data: category
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private (Admin/Manager)
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description, isActive, sortOrder } = req.body;

    // Check if category with same name exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Bu isimde bir kategori zaten mevcut' });
    }

    const category = new Category({
      name,
      description,
      isActive,
      sortOrder
    });

    await category.save();

    res.status(201).json({
      success: true,
      message: 'Kategori başarıyla oluşturuldu',
      data: category
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (Admin/Manager)
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { name, description, isActive, sortOrder } = req.body;

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Kategori bulunamadı' });
    }

    // Check if another category with same name exists
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ name, _id: { $ne: req.params.id } });
      if (existingCategory) {
        return res.status(400).json({ message: 'Bu isimde bir kategori zaten mevcut' });
      }
    }

    // Update fields
    if (name !== undefined) category.name = name;
    if (description !== undefined) category.description = description;
    if (isActive !== undefined) category.isActive = isActive;
    if (sortOrder !== undefined) category.sortOrder = sortOrder;

    await category.save();

    res.json({
      success: true,
      message: 'Kategori başarıyla güncellendi',
      data: category
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (Admin)
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Kategori bulunamadı' });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Kategori başarıyla silindi'
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// @desc    Update category image
// @route   PUT /api/categories/:id/image
// @access  Private (Admin/Manager)
export const updateCategoryImage = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Kategori bulunamadı' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Resim dosyası gerekli' });
    }

    category.image = `/uploads/${req.file.filename}`;
    await category.save();

    res.json({
      success: true,
      message: 'Kategori resmi başarıyla güncellendi',
      data: category
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};
