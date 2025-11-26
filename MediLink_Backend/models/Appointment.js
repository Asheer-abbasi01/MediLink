// models/Appointment.js
const appointmentSchema = new mongoose.Schema({
  patient: {type: mongoose.Schema.Types.ObjectId, ref:'User', required:true},
  doctor: {type: mongoose.Schema.Types.ObjectId, ref:'Doctor', required:true},
  scheduledAt: {type:Date, required:true, index:true},
  durationMinutes: {type:Number, default:15},
  status: {type:String, enum:['pending','confirmed','completed','cancelled','no-show'], default:'pending'},
  videoSession: { joinUrl:String, meetingId:String },
  kioskId: {type: mongoose.Schema.Types.ObjectId, ref:'Kiosk'},
  prescription: {type: mongoose.Schema.Types.ObjectId, ref:'Prescription'}
},{timestamps:true});
module.exports = mongoose.model('Appointment', appointmentSchema);
