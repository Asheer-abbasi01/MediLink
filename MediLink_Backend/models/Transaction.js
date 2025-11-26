import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    medicineId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medicine',
        required: true
    },
    medicineName: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    purchaseDate: {
        type: Date,
        default: Date.now
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
        // Optional: if you want to track which user made the purchase
    }
}, {
    timestamps: true
});

// ✅ Safe pattern to prevent OverwriteModelError
const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema, 'transactions');

export default Transaction;
