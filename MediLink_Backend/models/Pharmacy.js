// models/Pharmacy.js
const pharmacySchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref:'User'}, // account for the pharmacy
  name: String,
  location: { type: { type: String }, coordinates: [Number] }, // GeoJSON
  inventory: [{
    medicine: {type: mongoose.Schema.Types.ObjectId, ref:'Medicine'},
    stock: Number,
    price: Number
  }],
  deliveryOptions: [String]
});
pharmacySchema.index({ location: '2dsphere' });
module.exports = mongoose.model('Pharmacy', pharmacySchema);
