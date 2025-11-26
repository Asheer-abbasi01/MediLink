import express from "express";
import {
  createMedicine,
  getAllMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
  purchaseMedicine
} from "../controllers/medicineController.js";

const router = express.Router();

router.post("/", createMedicine);
router.get("/", getAllMedicines);
router.get("/:id", getMedicineById);
router.put("/:id", updateMedicine);
router.delete("/:id", deleteMedicine);
router.post("/:id/purchase", purchaseMedicine);

export default router;