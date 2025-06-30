import { Request, Response } from 'express';
import Product from '../models/Product';
import Category from '../models/Category';
import mongoose from 'mongoose';

// @desc    Get all products with filtering and pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter: any = { isActive: true };

    if (req.query.category) {
      filter.categoryId = req.query.category;
    }

    if (req.query.popular === 'true') {
      filter.isPopular = true;
    }

    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice as string);
      if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice as string);
    }

    // Sort options
    let sortOption: any = { sortOrder: 1, createdAt: -1 };
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price_asc':
          sortOption = { price: 1 };
          break;
        case 'price_desc':
          sortOption = { price: -1 };
          break;
        case 'name_asc':
          sortOption = { name: 1 };
          break;
        case 'name_desc':
          sortOption = { name: -1 };
          break;
        case 'newest':
          sortOption = { createdAt: -1 };
          break;
        case 'popular':
          sortOption = { isPopular: -1, createdAt: -1 };
          break;
      }
    }

    const products = await Product.find(filter)
      .populate('categoryId', 'name')
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      count: products.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: products
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:categoryId
// @access  Public
export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;

    // Validate categoryId
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: 'Geçersiz kategori ID' });
    }

    // Check if category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Kategori bulunamadı' });
    }

    const products = await Product.find({ 
      categoryId, 
      isActive: true 
    })
    .populate('categoryId', 'name')
    .sort({ sortOrder: 1, createdAt: -1 });

    res.json({
      success: true,
      count: products.length,
      category: category.name,
      data: products
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('categoryId', 'name description');

    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı' });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Admin/Manager)
export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      price,
      categoryId,
      ingredients,
      allergens,
      isActive,
      isPopular,
      sortOrder,
      nutritionalInfo
    } = req.body;

    // Validate categoryId
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: 'Geçersiz kategori ID' });
    }

    // Check if category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Kategori bulunamadı' });
    }

    const product = new Product({
      name,
      description,
      price,
      categoryId,
      ingredients,
      allergens,
      isActive,
      isPopular,
      sortOrder,
      nutritionalInfo
    });

    await product.save();
    await product.populate('categoryId', 'name');

    res.status(201).json({
      success: true,
      message: 'Ürün başarıyla oluşturuldu',
      data: product
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Admin/Manager)
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı' });
    }

    const {
      name,
      description,
      price,
      categoryId,
      ingredients,
      allergens,
      isActive,
      isPopular,
      sortOrder,
      nutritionalInfo
    } = req.body;

    // Validate categoryId if provided
    if (categoryId && !mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: 'Geçersiz kategori ID' });
    }

    if (categoryId) {
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ message: 'Kategori bulunamadı' });
      }
    }

    // Update fields
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (categoryId !== undefined) product.categoryId = categoryId;
    if (ingredients !== undefined) product.ingredients = ingredients;
    if (allergens !== undefined) product.allergens = allergens;
    if (isActive !== undefined) product.isActive = isActive;
    if (isPopular !== undefined) product.isPopular = isPopular;
    if (sortOrder !== undefined) product.sortOrder = sortOrder;
    if (nutritionalInfo !== undefined) product.nutritionalInfo = nutritionalInfo;

    await product.save();
    await product.populate('categoryId', 'name');

    res.json({
      success: true,
      message: 'Ürün başarıyla güncellendi',
      data: product
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Admin)
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı' });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Ürün başarıyla silindi'
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// @desc    Update product images
// @route   PUT /api/products/:id/images
// @access  Private (Admin/Manager)
export const updateProductImages = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı' });
    }

    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({ message: 'En az bir resim dosyası gerekli' });
    }

    const imageUrls = req.files.map((file: any) => `/uploads/${file.filename}`);
    
    // Replace or add images
    if (req.body.replace === 'true') {
      product.images = imageUrls;
    } else {
      product.images = [...product.images, ...imageUrls];
    }

    await product.save();

    res.json({
      success: true,
      message: 'Ürün resimleri başarıyla güncellendi',
      data: product
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};
