import MedicinePrescription from '../models/medicinePrescriptionModel.js';

// ✅ Create a new prescription
export const createPrescription = async (req, res) => {
  try {
    const data = await MedicinePrescription.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Get all prescriptions
export const getAllPrescriptions = async (req, res) => {
  try {
    const data = await MedicinePrescription.find();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get prescription by ID
export const getPrescriptionById = async (req, res) => {
  try {
    const data = await MedicinePrescription.findById(req.params.id);
    if (!data) return res.status(404).json({ message: "Prescription not found" });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update prescription by ID
export const updatePrescription = async (req, res) => {
  try {
    const data = await MedicinePrescription.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!data) return res.status(404).json({ message: "Prescription not found" });
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Delete prescription by ID
export const deletePrescription = async (req, res) => {
  try {
    const data = await MedicinePrescription.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ message: "Prescription not found" });
    res.status(200).json({ message: "Prescription deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
