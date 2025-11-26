const Diagnosis = require('../models/diagnosisModel');

exports.createDiagnosis = async (req, res) => {
  try { const data = await Diagnosis.create(req.body); res.status(201).json(data); }
  catch (err) { res.status(400).json({ error: err.message }); }
};

exports.getAllDiagnosis = async (req, res) => {
  try { const data = await Diagnosis.find(); res.status(200).json(data); }
  catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getDiagnosisById = async (req, res) => {
  try { const data = await Diagnosis.findById(req.params.id);
    if (!data) return res.status(404).json({ message: "Diagnosis not found" });
    res.status(200).json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.updateDiagnosis = async (req, res) => {
  try { const data = await Diagnosis.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!data) return res.status(404).json({ message: "Diagnosis not found" });
    res.status(200).json(data);
  } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.deleteDiagnosis = async (req, res) => {
  try { const data = await Diagnosis.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ message: "Diagnosis not found" });
    res.status(200).json({ message: "Diagnosis deleted" });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
