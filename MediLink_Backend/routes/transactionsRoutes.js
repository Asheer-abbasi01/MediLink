import express from "express";
import { processPayment } from "../transactions.js";

const router = express.Router();

router.post("/payment", async (req, res) => {
  const { billId, patientId, amount, paymentMethod, cardDetails, medicinesUsed } = req.body;

  const result = await processPayment({ billId, patientId, amount, paymentMethod, cardDetails, medicinesUsed });

  if (result.success) {
    res.json({ message: result.message });
  } else {
    res.status(500).json({ message: result.message });
  }
});

export default router;
