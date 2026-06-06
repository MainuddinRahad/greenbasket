const express = require('express');
const router = express.Router();
const SSLCommerzPayment = require('sslcommerz-lts');
const Order = require('../models/Order');
const { protect } = require('../middleware/authMiddleware');

const store_id = process.env.SSLCOMMERZ_STORE_ID;
const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
const is_live = process.env.SSLCOMMERZ_IS_LIVE === 'true';
const backendUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;

router.post('/init', protect, async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId).populate('user', 'name email phone');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const data = {
      total_amount: order.totalPrice,
      currency: 'BDT',
      tran_id: `GB_${orderId}_${Date.now()}`,
      success_url: `${backendUrl}/api/payment/success?orderId=${orderId}`,
      fail_url: `${backendUrl}/api/payment/fail?orderId=${orderId}`,
      cancel_url: `${backendUrl}/api/payment/cancel?orderId=${orderId}`,
      ipn_url: `${backendUrl}/api/payment/ipn`,
      shipping_method: 'Courier',
      product_name: 'GreenBasket Order',
      product_category: 'Grocery',
      product_profile: 'general',
      cus_name: order.shippingAddress.name,
      cus_email: order.user.email,
      cus_add1: order.shippingAddress.address,
      cus_city: order.shippingAddress.city,
      cus_postcode: order.shippingAddress.postalCode || '1000',
      cus_country: 'Bangladesh',
      cus_phone: order.shippingAddress.phone,
      ship_name: order.shippingAddress.name,
      ship_add1: order.shippingAddress.address,
      ship_city: order.shippingAddress.city,
      ship_postcode: order.shippingAddress.postalCode || '1000',
      ship_country: 'Bangladesh',
    };

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const apiResponse = await sslcz.init(data);

    if (apiResponse?.GatewayPageURL) {
      order.transactionId = data.tran_id;
      await order.save();
      res.json({ url: apiResponse.GatewayPageURL });
    } else {
      res.status(500).json({ message: 'Payment gateway error' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/success', async (req, res) => {
  try {
    const { val_id, tran_id } = req.body;
    const orderId = tran_id.split('_')[1];
    const order = await Order.findById(orderId);
    if (order) {
      order.paymentStatus = 'Paid';
      order.orderStatus = 'Confirmed';
      await order.save();
    }
    res.redirect(`${process.env.FRONTEND_URL}/payment/success?orderId=${orderId}`);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/fail', async (req, res) => {
  const { tran_id } = req.body;
  const orderId = tran_id.split('_')[1];
  res.redirect(`${process.env.FRONTEND_URL}/payment/fail?orderId=${orderId}`);
});

router.post('/cancel', async (req, res) => {
  const { tran_id } = req.body;
  const orderId = tran_id ? tran_id.split('_')[1] : '';
  res.redirect(`${process.env.FRONTEND_URL}/payment/cancel?orderId=${orderId}`);
});

module.exports = router;
