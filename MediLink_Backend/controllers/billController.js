
import Bill from "../models/Bill.js"; // Make sure the filename matches exactly

// CREATE a new bill
export const createBill = async (req, res) => {
  try {
    const data = await Bill.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET all bills (limit to 100 records)
export const getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find({})
      .limit(100)   // limit output to 100
      .lean();      // faster, plain JS objects

    res.status(200).json(bills); // returns array directly
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET a single bill by ID
export const getBillById = async (req, res) => {
  try {
    const data = await Bill.findById(req.params.id).lean();
    if (!data) return res.status(404).json({ message: "Bill not found" });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE a bill by ID
export const updateBill = async (req, res) => {
  try {
    const data = await Bill.findByIdAndUpdate(req.params.id, req.body, { new: true, lean: true });
    if (!data) return res.status(404).json({ message: "Bill not found" });
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE a bill by ID
export const deleteBill = async (req, res) => {
  try {
    const data = await Bill.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ message: "Bill not found" });
    res.status(200).json({ message: "Bill deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
