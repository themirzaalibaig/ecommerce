import mongoose, { Schema, Model } from 'mongoose';
import { Product, Size } from '../types/models';

export interface ProductDocument extends Omit<Product, 'category'>, mongoose.Document {
  _id: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
}

const productSchema = new Schema<ProductDocument>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Product slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    tags: {
      type: [String],
      default: [],
    },
    thumbnail: {
      type: String,
      required: [true, 'Product thumbnail is required'],
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function (images: string[]) {
          return images.length <= 10;
        },
        message: 'Cannot upload more than 10 images',
      },
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product category is required'],
    },
    size: {
      type: [String],
      enum: Object.values(Size),
      default: [],
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    totalStock: {
      type: Number,
      default: 0,
      min: [0, 'Total stock cannot be negative'],
    },
    totalSold: {
      type: Number,
      default: 0,
      min: [0, 'Total sold cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

// Generate slug from name before saving
productSchema.pre('save', function (next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = (this.name as string)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  // Update inStock based on stock
  this.inStock = (this.stock as number) > 0;

  next();
});

// Virtual for average rating (if you add reviews)
productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
});

// Indexes
productSchema.index({ slug: 1 });
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ inStock: 1 });
productSchema.index({ createdAt: -1 });

export const ProductModel: Model<ProductDocument> = mongoose.model<ProductDocument>(
  'Product',
  productSchema
);

