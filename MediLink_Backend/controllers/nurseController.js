const Nurse = require('../models/nurseModel');

exports.createNurse = async (req, res) => {
  try { const data = await Nurse.create(req.body); res.status(201).json(data); }
  catch (err) { res.status(400).json({ error: err.message }); }
};

exports.getAllNurses = async (req, res) => {
  try { const data = await Nurse.find(); res.status(200).json(data); }
  catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getNurseById = async (req, res) => {
  try { const data = await Nurse.findById(req.params.id);
    if (!data) return res.status(404).json({ message: "Nurse not found" });
    res.status(200).json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.updateNurse = async (req, res) => {
  try { const data = await Nurse.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!data) return res.status(404).json({ message: "Nurse not found" });
    res.status(200).json(data);
  } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.deleteNurse = async (req, res) => {
  try { const data = await Nurse.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ message: "Nurse not found" });
    res.status(200).json({ message: "Nurse deleted" });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
