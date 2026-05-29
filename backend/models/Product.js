const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Books',
        'Electronics',
        'Furniture',
        'Clothes',
        'Food',
        'Nursing/Medical Supplies',
        'Teaching Materials',
        'Others',
      ],
    },
    images: {
      type: [String],
      validate: [(arr) => arr.length <= 5, 'Product cannot have more than 5 images'],
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    institution: {
      type: String,
      required: [true, 'Institution is required'],
      trim: true,
    },
    institutionType: {
      type: String,
      enum: ['UNIVERSITY', 'NURSING', 'TEACHER'],
    },
    region: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Region',
      required: true,
    },
    isAvailable: { type: Boolean, default: true },
    isFlagged: { type: Boolean, default: false },
    flagReason: { type: String },
    views: { type: Number, default: 0 },
    condition: {
      type: String,
      enum: ['New', 'Like New', 'Good', 'Fair', 'Poor'],
      default: 'Good',
    },
    negotiable: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ProductSchema.index({ institution: 1, category: 1 });
ProductSchema.index({ region: 1 });
ProductSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Product', ProductSchema);
