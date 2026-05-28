const mongoose = require('mongoose');

const InstitutionSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: {
    type: String,
    enum: ['UNIVERSITY', 'NURSING', 'TEACHER'],
    required: true,
  },
  isActive: { type: Boolean, default: true },
});

const RegionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    isActive: { type: Boolean, default: true },
    institutions: [InstitutionSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Region', RegionSchema);
