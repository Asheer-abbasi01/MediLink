// Backend Code for Medicine Purchase System
// Add these changes to your backend

// ============================================
// 1. UPDATE MEDICINE MODEL/SCHEMA
// ============================================
// File: models/Medicine.js (or wherever your medicine schema is defined)

const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
    medicineId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    genericName: {
        type: String
    },
    manufacturer: {
        type: String
    },
    dosage: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Available', 'Out of Stock'],
        default: 'Available'
    },
    // ADD THIS NEW FIELD
    stock: {
        type: Number,
        default: 0,
        min: 0
    }
}, {
    timestamps: true
});

// Auto-update status based on stock
medicineSchema.pre('save', function (next) {
    if (this.stock === 0) {
        this.status = 'Out of Stock';
    } else if (this.stock > 0 && this.status === 'Out of Stock') {
        this.status = 'Available';
    }
    next();
});

module.exports = mongoose.model('Medicine', medicineSchema);

// ============================================
// 2. ADD PURCHASE ENDPOINT TO MEDICINE ROUTES
// ============================================
// File: routes/medicines.js (or your medicine routes file)

const express = require('express');
const router = express.Router();
const Medicine = require('../models/Medicine');

// ... your existing routes ...

// NEW ROUTE: Purchase Medicine
router.post('/:id/purchase', async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        // Validate quantity
        if (!quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: 'Invalid quantity'
            });
        }

        // Find medicine
        const medicine = await Medicine.findById(id);
        if (!medicine) {
            return res.status(404).json({
                success: false,
                message: 'Medicine not found'
            });
        }

        // Check stock availability
        if (medicine.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: `Insufficient stock. Only ${medicine.stock} available.`
            });
        }

        // Check if medicine is available
        if (medicine.status === 'Out of Stock') {
            return res.status(400).json({
                success: false,
                message: 'Medicine is out of stock'
            });
        }

        // Decrement stock
        medicine.stock -= quantity;

        // Update status if stock reaches 0
        if (medicine.stock === 0) {
            medicine.status = 'Out of Stock';
        }

        await medicine.save();

        // Optional: Create transaction record
        // const transaction = await Transaction.create({
        //   medicineId: medicine._id,
        //   medicineName: medicine.name,
        //   quantity: quantity,
        //   price: medicine.price,
        //   totalAmount: medicine.price * quantity,
        //   purchaseDate: new Date()
        // });

        res.json({
            success: true,
            message: 'Purchase successful!',
            medicine: medicine,
            purchaseDetails: {
                quantity: quantity,
                totalAmount: medicine.price * quantity
            }
        });

    } catch (error) {
        console.error('Purchase error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during purchase'
        });
    }
});

module.exports = router;

// ============================================
// 3. OPTIONAL: TRANSACTION MODEL (if you want to track purchases)
// ============================================
// File: models/Transaction.js

const mongoose = require('mongoose');

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

module.exports = mongoose.model('Transaction', transactionSchema);

// ============================================
// 4. UPDATE EXISTING MEDICINES IN DATABASE
// ============================================
// Run this script once to add stock field to existing medicines
// File: scripts/addStockToMedicines.js

const mongoose = require('mongoose');
const Medicine = require('../models/Medicine');

async function addStockToExistingMedicines() {
    try {
        await mongoose.connect('your_mongodb_connection_string');

        // Update all medicines without stock field
        const result = await Medicine.updateMany(
            { stock: { $exists: false } },
            { $set: { stock: 50 } } // Set default stock to 50 (or any number you prefer)
        );

        console.log(`Updated ${result.modifiedCount} medicines with stock field`);

        // Update status based on stock
        await Medicine.updateMany(
            { stock: 0 },
            { $set: { status: 'Out of Stock' } }
        );

        await Medicine.updateMany(
            { stock: { $gt: 0 } },
            { $set: { status: 'Available' } }
        );

        console.log('Stock migration completed!');
        process.exit(0);
    } catch (error) {
        console.error('Migration error:', error);
        process.exit(1);
    }
}

addStockToExistingMedicines();

// ============================================
// INSTRUCTIONS:
// ============================================
// 1. Update your Medicine model with the stock field
// 2. Add the purchase route to your medicine routes
// 3. (Optional) Create Transaction model if you want to track purchases
// 4. Run the migration script to add stock to existing medicines
// 5. Restart your backend server
// 6. The frontend will now be able to make purchase requests
