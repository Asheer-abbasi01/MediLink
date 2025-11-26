const Record = require('../models/recordModel');

exports.createRecord = async (req, res) => {
  try { const data = await Record.create(req.body); res.status(201).json(data); }
  catch (err) { res.status(400).json({ error: err.message }); }
};

exports.getAllRecords = async (req, res) => {
  try { const data = await Record.find(); res.status(200).json(data); }
  catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getRecordById = async (req, res) => {
  try { const data = await Record.findById(req.params.id);
    if (!data) return res.status(404).json({ message: "Record not found" });
    res.status(200).json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.updateRecord = async (req, res) => {
  try { const data = await Record.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!data) return res.status(404).json({ message: "Record not found" });
    res.status(200).json(data);
  } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.deleteRecord = async (req, res) => {
  try { const data = await Record.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ message: "Record not found" });
    res.status(200).json({ message: "Record deleted" });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
