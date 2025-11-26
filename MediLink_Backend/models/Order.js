// models/Order.js
const orderSchema = new mongoose.Schema({
  prescription: {type: mongoose.Schema.Types.ObjectId, ref:'Prescription'},
  patient: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  pharmacy: {type: mongoose.Schema.Types.ObjectId, ref:'Pharmacy'},
  items: [{ medicine: {type:mongoose.Schema.Types.ObjectId, ref:'Medicine'}, qty:Number, price:Number }],
  total: Number,
  status: {type:String, enum:['pending','processing','dispatched','delivered','cancelled'], default:'pending'},
  paymentRef: String,
  courier: { name:String, trackingId:String, eta:Date }
},{timestamps:true});
module.exports = mongoose.model('Order', orderSchema);
