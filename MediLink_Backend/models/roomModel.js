import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  roomId: { type: Number, required: true, unique: true },
  nurseId: { type: Number },
  type: String,
  roomNumber: String,
  floor: Number,
  capacity: Number,
  facilities: [{ type: String }],
  hourlyRate: { type: Number },
  status: String,
  references: {
    nurse: { nurseId: Number }
  }
}, { timestamps: true });

const Room = mongoose.model("Room", roomSchema);
export default Room;
