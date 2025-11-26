import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
  medicineId: {
    type: String,
    unique: true,
    sparse: true // Allows null values while maintaining uniqueness for non-null values
  },
  name: {
    type: String,
    required: true
  },
  brand: String,
  genericName: String,
  manufacturer: String,
  dosage: String,
  sku: String,
  description: String,
  price: {
    type: Number,
    required: true
  },
  unit: String,
  status: {
    type: String,
    enum: ['Available', 'Out of Stock'],
    default: 'Available'
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  }
}, { timestamps: true });

// Auto-update status based on stock
medicineSchema.pre('save', function (next) {
  if (this.stock === 0) {
    this.status = 'Out of Stock';
  } else if (this.stock > 0 && this.status === 'Out of Stock') {
    this.status = 'Available';
  }
  next();
});

// ✅ Safe pattern to prevent OverwriteModelError
const Medicine = mongoose.models.Medicine || mongoose.model('Medicine', medicineSchema, 'medicine');

export default Medicine;
