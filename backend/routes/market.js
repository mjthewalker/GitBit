const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Importing the models from the 'market' file
const { Seller, Order, Payment } = require('../models/market');

// 1. Fetch all sellers
router.get('/sellers', async (req, res) => {
  try {
    const sellers = await Seller.find();
    res.status(200).json(sellers);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching sellers', error: err });
  }
});

// 2. Fetch details of a specific seller
router.get('/sellers/:id', async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }
    res.status(200).json(seller);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching seller details', error: err });
  }
});

// 3. Place an order
router.post('/order', async (req, res) => {
  const { buyerId, sellerId, quantity, totalPrice } = req.body;

  try {
    const newOrder = new Order({
      buyerId,
      sellerId,
      quantity,
      totalPrice,
      status: 'pending', // Set initial order status
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (err) {
    res.status(500).json({ message: 'Error placing order', error: err });
  }
});

// 4. Get all orders of a user
router.get('/orders/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ buyerId: req.params.userId });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders', error: err });
  }
});

// 5. Get details of a specific order
router.get('/orders/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching order details', error: err });
  }
});

// 6. Process the payment for an order
router.post('/payment', async (req, res) => {
  const { orderId, paymentMethod, paymentDetails } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order || order.status !== 'pending') {
      return res.status(400).json({ message: 'Invalid order or order already processed' });
    }

    // Simulate a payment gateway process (replace with actual gateway logic)
    const paymentStatus = { success: true };  // Simulated success response

    if (paymentStatus.success) {
      order.status = 'paid';
      await order.save();

      const newPayment = new Payment({
        orderId,
        amount: order.totalPrice,
        paymentMethod,
        paymentDetails,
        status: 'success',
      });
      await newPayment.save();

      res.status(200).json({ message: 'Payment successful', order });
    } else {
      res.status(400).json({ message: 'Payment failed' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error processing payment', error: err });
  }
});

// 7. Get payment status
router.get('/payment/:paymentId', async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.status(200).json(payment);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching payment status', error: err });
  }
});

// Export the router to be used in the app
module.exports = router;
