// import Payment from "../models/paymentModel.js";

// export const createPayment = async (req, res) => {
//   try {
//     const data = await Payment.create(req.body);
//     res.status(201).json(data);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// export const getAllPayments = async (req, res) => {
//   try {
//     const data = await Payment.find();
//     res.status(200).json(data);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// export const getPaymentById = async (req, res) => {
//   try {
//     const data = await Payment.findById(req.params.id);
//     if (!data) return res.status(404).json({ message: "Payment not found" });
//     res.status(200).json(data);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// export const updatePayment = async (req, res) => {
//   try {
//     const data = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!data) return res.status(404).json({ message: "Payment not found" });
//     res.status(200).json(data);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// export const deletePayment = async (req, res) => {
//   try {
//     const data = await Payment.findByIdAndDelete(req.params.id);
//     if (!data) return res.status(404).json({ message: "Payment not found" });
//     res.status(200).json({ message: "Payment deleted" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


import Payment from "../models/paymentModel.js";

// CREATE a new payment
export const createPayment = async (req, res) => {
  try {
    const data = await Payment.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET all payments (limit 70)
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find({})
      .limit(70)  // limit output to 70
      .lean();    // faster, plain JS objects

    res.status(200).json(payments); // returns array directly
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET a single payment by ID
export const getPaymentById = async (req, res) => {
  try {
    const data = await Payment.findById(req.params.id).lean();
    if (!data) return res.status(404).json({ message: "Payment not found" });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE a payment by ID
export const updatePayment = async (req, res) => {
  try {
    const data = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true, lean: true });
    if (!data) return res.status(404).json({ message: "Payment not found" });
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE a payment by ID
export const deletePayment = async (req, res) => {
  try {
    const data = await Payment.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ message: "Payment not found" });
    res.status(200).json({ message: "Payment deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

