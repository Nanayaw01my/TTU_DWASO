const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['student', 'vendor', 'admin'],
      required: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [100, 'Full name cannot exceed 100 characters'],
    },
    businessName: {
      type: String,
      trim: true,
      maxlength: [150, 'Business name cannot exceed 150 characters'],
    },
    businessDescription: {
      type: String,
      trim: true,
      maxlength: [500, 'Business description cannot exceed 500 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    studentId: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^(\+233|0)[0-9]{9}$/, 'Please provide a valid Ghana phone number'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    region: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Region',
      required: [true, 'Region is required'],
    },
    institution: {
      type: String,
      required: [true, 'Institution is required'],
      trim: true,
    },
    institutionType: {
      type: String,
      enum: ['UNIVERSITY', 'NURSING', 'TEACHER'],
      required: [true, 'Institution type is required'],
    },
    ghanaCardFront: { type: String },
    ghanaCardBack: { type: String },
    passportPhoto: { type: String },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isSuspended: {
      type: Boolean,
      default: false,
    },
    suspendedReason: { type: String },
    rejectedReason: { type: String },
    approvedAt: { type: Date },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    lastLogin: { type: Date },
    avatar: { type: String },
  },
  { timestamps: true }
);

// Auto-approve students and admins; vendors need manual approval
UserSchema.pre('save', function (next) {
  if (this.isNew && (this.role === 'student' || this.role === 'admin')) {
    this.isApproved = true;
  }
  next();
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT
UserSchema.methods.generateToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role, institution: this.institution },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

module.exports = mongoose.model('User', UserSchema);
