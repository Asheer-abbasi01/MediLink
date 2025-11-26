const Room = require('../models/roomModel');

exports.createRoom = async (req, res) => {
  try { const data = await Room.create(req.body); res.status(201).json(data); }
  catch (err) { res.status(400).json({ error: err.message }); }
};

exports.getAllRooms = async (req, res) => {
  try { const data = await Room.find(); res.status(200).json(data); }
  catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getRoomById = async (req, res) => {
  try { const data = await Room.findById(req.params.id);
    if (!data) return res.status(404).json({ message: "Room not found" });
    res.status(200).json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.updateRoom = async (req, res) => {
  try { const data = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!data) return res.status(404).json({ message: "Room not found" });
    res.status(200).json(data);
  } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.deleteRoom = async (req, res) => {
  try { const data = await Room.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ message: "Room not found" });
    res.status(200).json({ message: "Room deleted" });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
