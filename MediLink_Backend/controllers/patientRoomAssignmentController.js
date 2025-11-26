import PatientRoomAssignment from '../models/patientRoomAssignmentModel.js';

export async function createAssignment(req, res) {
  try {
    const data = await PatientRoomAssignment.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getAllAssignments(req, res) {
  try {
    const data = await PatientRoomAssignment.find();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getAssignmentById(req, res) {
  try {
    const data = await PatientRoomAssignment.findById(req.params.id);
    if (!data) return res.status(404).json({ message: "Assignment not found" });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateAssignment(req, res) {
  try {
    const data = await PatientRoomAssignment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!data) return res.status(404).json({ message: "Assignment not found" });
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteAssignment(req, res) {
  try {
    const data = await PatientRoomAssignment.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ message: "Assignment not found" });
    res.status(200).json({ message: "Assignment deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
