// import Medicine from "../models/Medicine.js"; // go up one folder

// // Create a new medicine
// export const createMedicine = async (req, res) => {
//   try {
//     const data = await Medicine.create(req.body);
//     res.status(201).json(data);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// // Get all medicines
// export const getAllMedicines = async (req, res) => {
//   try {
//     const data = await Medicine.find();
//     res.status(200).json(data);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Get medicine by ID
// export const getMedicineById = async (req, res) => {
//   try {
//     const data = await Medicine.findById(req.params.id);
//     if (!data) return res.status(404).json({ message: "Medicine not found" });
//     res.status(200).json(data);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Update medicine
// export const updateMedicine = async (req, res) => {
//   try {
//     const data = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!data) return res.status(404).json({ message: "Medicine not found" });
//     res.status(200).json(data);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// // Delete medicine
// export const deleteMedicine = async (req, res) => {
//   try {
//     const data = await Medicine.findByIdAndDelete(req.params.id);
//     if (!data) return res.status(404).json({ message: "Medicine not found" });
//     res.status(200).json({ message: "Medicine deleted" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };



import Medicine from "../models/Medicine.js"; // Make sure the path matches

// CREATE a new medicine
export const createMedicine = async (req, res) => {
  try {
    const data = await Medicine.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET all medicines (limit 100)
export const getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({})
      .limit(100)  // limit output to 100
      .lean();     // faster, plain JS objects

    res.status(200).json(medicines); // returns array directly
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET a single medicine by ID
export const getMedicineById = async (req, res) => {
  try {
    const data = await Medicine.findById(req.params.id).lean();
    if (!data) return res.status(404).json({ message: "Medicine not found" });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE a medicine by ID
export const updateMedicine = async (req, res) => {
  try {
    const data = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true, lean: true });
    if (!data) return res.status(404).json({ message: "Medicine not found" });
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE a medicine by ID
export const deleteMedicine = async (req, res) => {
  try {
    const data = await Medicine.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ message: "Medicine not found" });
    res.status(200).json({ message: "Medicine deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PURCHASE medicine - decrement stock
export const purchaseMedicine = async (req, res) => {
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

    // The pre-save hook will automatically update status if stock reaches 0
    await medicine.save();

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
};

