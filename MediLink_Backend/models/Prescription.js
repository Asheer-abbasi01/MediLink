// models/Prescription.js
const prescriptionSchema = new mongoose.Schema({
  appointment: {type: mongoose.Schema.Types.ObjectId, ref:'Appointment'},
  doctor: {type: mongoose.Schema.Types.ObjectId, ref:'Doctor'},
  patient: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  items: [{
    medicine: {type: mongoose.Schema.Types.ObjectId, ref:'Medicine'},
    dose: String,
    frequency: String,
    duration: String,
    instructions: String
  }],
  notes: String,
  issuedAt: {type:Date, default:Date.now},
  fulfilled: {type:Boolean, default:false}
},{timestamps:true});
module.exports = mongoose.model('Prescription', prescriptionSchema);
