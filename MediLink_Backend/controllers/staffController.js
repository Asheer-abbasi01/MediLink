const Staff = require('../models/staffModel');
exports.createStaff = async (req, res) => {
  try { const data = await Staff.create(req.body); res.status(201).json(data); }
  catch (err) { res.status(400).json({ error: err.message }); }
};
exports.getAllStaff = async (req, res) => {
  try { const data = await Staff.find(); res.status(200).json(data); }
  catch (err) { res.status(500).json({ error: err.message }); }
};
exports.getStaffById = async (req, res) => {
  try { const data = await Staff.findById(req.params.id);
    if (!data) return res.status(404).json({ message: "Staff not found" });
    res.status(200).json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
};
exports.updateStaff = async (req, res) => {
  try { const data = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!data) return res.status(404).json({ message: "Staff not found" });
    res.status(200).json(data);
  } catch (err) { res.status(400).json({ error: err.message }); }
};
exports.deleteStaff = async (req, res) => {
  try { const data = await Staff.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ message: "Staff not found" });
    res.status(200).json({ message: "Staff deleted" });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
