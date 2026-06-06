const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
    if (!wishlist) wishlist = { products: [] };
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/toggle', protect, async (req, res) => {
  try {
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    const index = wishlist.products.indexOf(productId);
    if (index === -1) {
      wishlist.products.push(productId);
    } else {
      wishlist.products.splice(index, 1);
    }
    await wishlist.save();
    res.json({ message: 'Wishlist updated', products: wishlist.products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
