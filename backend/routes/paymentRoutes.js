const express = require('express');
const router = express.Router();
const SSLCommerzPayment = require('sslcommerz-lts');
const Order = require('../models/Order');
const { protect } = require('../middleware/authMiddleware');

const store_id = process.env.SSLCOMMERZ_STORE_ID;
const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
const is_live = process.env.SSLCOMMERZ_IS_LIVE === 'true';
const isSandbox = !is_live;
const backendUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

const getOrderIdFromRequest = (req) => {
  if (req.query?.orderId) return req.query.orderId;
  const tranId = req.body?.tran_id || req.query?.tran_id || '';
  const parts = tranId.split('_');
  return parts.length >= 2 ? parts[1] : null;
};

const redirectFront = (res, path, orderId) => {
  const query = orderId ? `?orderId=${orderId}` : '';
  return res.redirect(`${frontendUrl}${path}${query}`);
};

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

    if (!store_id || !store_passwd || isSandbox) {
      order.transactionId = data.tran_id;
      order.paymentStatus = 'Paid';
      order.orderStatus = 'Confirmed';
      await order.save();
      return res.json({ url: `${frontendUrl}/payment/success?orderId=${orderId}&sandbox=true` });
    }

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const apiResponse = await sslcz.init(data);

    if (apiResponse?.GatewayPageURL) {
      order.transactionId = data.tran_id;
      await order.save();
      return res.json({ url: apiResponse.GatewayPageURL });
    }

    return res.status(500).json({ message: 'Payment gateway error' });
  } catch (err) {
    if (!store_id || !store_passwd || isSandbox) {
      return res.json({ url: `${frontendUrl}/payment/success?orderId=${req.body.orderId}&sandbox=true` });
    }
    res.status(500).json({ message: err.message });
  }
});

const handlePaymentResult = async (req, res, status) => {
  const orderId = getOrderIdFromRequest(req);
  if (status === 'success' && orderId) {
    const order = await Order.findById(orderId);
    if (order) {
      order.paymentStatus = 'Paid';
      order.orderStatus = 'Confirmed';
      await order.save();
    }
  }

  return redirectFront(res, `/payment/${status}`, orderId);
};

router.post('/success', async (req, res) => handlePaymentResult(req, res, 'success'));
router.get('/success', async (req, res) => handlePaymentResult(req, res, 'success'));
router.post('/fail', async (req, res) => handlePaymentResult(req, res, 'fail'));
router.get('/fail', async (req, res) => handlePaymentResult(req, res, 'fail'));
router.post('/cancel', async (req, res) => handlePaymentResult(req, res, 'cancel'));
router.get('/cancel', async (req, res) => handlePaymentResult(req, res, 'cancel'));

router.post('/ipn', async (req, res) => {
  const orderId = getOrderIdFromRequest(req);
  if (orderId) {
    const order = await Order.findById(orderId);
    if (order && req.body?.status === 'VALID') {
      order.paymentStatus = 'Paid';
      order.orderStatus = 'Confirmed';
      await order.save();
    }
  }
  res.status(200).send('IPN received');
});

module.exports = router;
