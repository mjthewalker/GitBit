const mongoose = require('mongoose');

// Seller Model
const sellerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  carbonCreditsAvailable: { type: Number, required: true },
  pricePerCredit: { type: Number, required: true },
});

const Seller = mongoose.model('Seller', sellerSchema);

// Order Model
const orderSchema = new mongoose.Schema({
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid', 'shipped'], default: 'pending' },
});

const Order = mongoose.model('Order', orderSchema);

// Payment Model
const paymentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  paymentDetails: { type: Object, required: true },
  status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = { Seller, Order, Payment };
