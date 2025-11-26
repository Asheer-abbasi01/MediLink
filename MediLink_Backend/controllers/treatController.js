const Treat = require('../models/treatModel');

exports.createTreat = async (req, res) => {
  try { const data = await Treat.create(req.body); res.status(201).json(data); }
  catch (err) { res.status(400).json({ error: err.message }); }
};

exports.getAllTreats = async (req, res) => {
  try { const data = await Treat.find(); res.status(200).json(data); }
  catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getTreatById = async (req, res) => {
  try { const data = await Treat.findById(req.params.id);
    if (!data) return res.status(404).json({ message: "Treatment not found" });
    res.status(200).json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.updateTreat = async (req, res) => {
  try { const data = await Treat.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!data) return res.status(404).json({ message: "Treatment not found" });
    res.status(200).json(data);
  } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.deleteTreat = async (req, res) => {
  try { const data = await Treat.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ message: "Treatment not found" });
    res.status(200).json({ message: "Treatment deleted" });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
