const mongoose = require('mongoose');

const bikeSchema = new mongoose.Schema({
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String }, // you can create a Category model later
  condition: { type: String, enum: ['new', 'used'], required: true },
  imageUrl: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  isCheck: { type: String, enum: ['yes', 'no', 'refused', 'doing'], default: 'no' },
  isSold: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Bike', bikeSchema);
