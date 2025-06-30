import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  categoryId: mongoose.Types.ObjectId;
  images: string[];
  ingredients?: string[];
  allergens?: string[];
  isActive: boolean;
  isPopular: boolean;
  sortOrder: number;
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Ürün adı gerekli'],
    trim: true,
    maxlength: [200, 'Ürün adı 200 karakterden uzun olamaz']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Açıklama 1000 karakterden uzun olamaz']
  },
  price: {
    type: Number,
    required: [true, 'Fiyat gerekli'],
    min: [0, 'Fiyat negatif olamaz']
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Kategori gerekli']
  },
  images: [{
    type: String
  }],
  ingredients: [{
    type: String,
    trim: true
  }],
  allergens: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  nutritionalInfo: {
    calories: {
      type: Number,
      min: 0
    },
    protein: {
      type: Number,
      min: 0
    },
    carbs: {
      type: Number,
      min: 0
    },
    fat: {
      type: Number,
      min: 0
    }
  }
}, {
  timestamps: true
});

// Indexes for better performance
ProductSchema.index({ categoryId: 1, isActive: 1, sortOrder: 1 });
ProductSchema.index({ isPopular: 1, isActive: 1 });
ProductSchema.index({ price: 1 });

export default mongoose.model<IProduct>('Product', ProductSchema);
