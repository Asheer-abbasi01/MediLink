import Patient from "../models/patientModel.js"; // ✅ correct import

// Create a new patient
export const createPatient = async (req, res) => {
  try {
    // Map incoming fields to schema fields
    const { patientId, name, age, gender, contact, address, medicalHistory } = req.body;
    const [firstName, ...lastNameParts] = name ? name.split(' ') : ['', ''];
    const lastName = lastNameParts.join(' ');
    const patientData = {
      patientId,
      firstName: firstName || '',
      lastName: lastName || '',
      gender,
      phoneNo: contact,
      address,
      medicalHistory,
    };
    const patient = await Patient.create(patientData);
    res.status(201).json(patient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all patients
export const getAllPatients = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100; // default 100
    const patients = await Patient.find().limit(limit).lean();
    res.status(200).json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Get one patient by ID
export const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.status(200).json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update patient
export const updatePatient = async (req, res) => {
  try {
    // Map incoming fields for update
    const { patientId, name, age, gender, contact, address, medicalHistory } = req.body;
    const [firstName, ...lastNameParts] = name ? name.split(' ') : ['', ''];
    const lastName = lastNameParts.join(' ');
    const updateData = {
      ...(patientId && { patientId }),
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(gender && { gender }),
      ...(contact && { phoneNo: contact }),
      ...(address && { address }),
      ...(medicalHistory && { medicalHistory })
    };
    const patient = await Patient.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.status(200).json(patient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete patient
export const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
