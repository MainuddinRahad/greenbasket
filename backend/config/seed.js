const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

const Product = require('../models/Product');
const User = require('../models/User');

const products = [
  { name: 'Fresh Broccoli', description: 'Organic farm-fresh broccoli, rich in vitamins.', price: 80, originalPrice: 100, category: 'Vegetables', image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400', stock: 50, unit: 'kg', isFeatured: true },
  { name: 'Red Tomatoes', description: 'Juicy and fresh red tomatoes.', price: 60, originalPrice: 80, category: 'Vegetables', image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400', stock: 100, unit: 'kg', isFeatured: true },
  { name: 'Alphonso Mango', description: 'Sweet and aromatic Alphonso mangoes.', price: 250, originalPrice: 300, category: 'Fruits', image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400', stock: 30, unit: 'dozen', isFeatured: true },
  { name: 'Strawberries', description: 'Fresh red strawberries, perfect for desserts.', price: 180, originalPrice: 220, category: 'Fruits', image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400', stock: 40, unit: '500g', isFeatured: true },
  { name: 'Full Cream Milk', description: 'Fresh full cream milk from local farms.', price: 95, originalPrice: 110, category: 'Dairy', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400', stock: 60, unit: 'liter', isFeatured: false },
  { name: 'Greek Yogurt', description: 'Thick and creamy Greek yogurt.', price: 120, originalPrice: 150, category: 'Dairy', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400', stock: 45, unit: '400g', isFeatured: true },
  { name: 'Hilsa Fish', description: 'Fresh Hilsa fish from Padma river.', price: 1200, originalPrice: 1500, category: 'Meat & Fish', image: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=400', stock: 20, unit: 'kg', isFeatured: true },
  { name: 'Chicken Breast', description: 'Fresh boneless chicken breast.', price: 320, originalPrice: 380, category: 'Meat & Fish', image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400', stock: 35, unit: 'kg', isFeatured: false },
  { name: 'Whole Wheat Bread', description: 'Freshly baked whole wheat bread.', price: 75, originalPrice: 90, category: 'Bakery', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', stock: 25, unit: 'loaf', isFeatured: false },
  { name: 'Green Tea', description: 'Premium organic green tea bags.', price: 150, originalPrice: 180, category: 'Beverages', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', stock: 80, unit: '50 bags', isFeatured: false },
  { name: 'Potato Chips', description: 'Crispy salted potato chips.', price: 50, originalPrice: 60, category: 'Snacks', image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400', stock: 120, unit: '150g', isFeatured: false },
  { name: 'Organic Spinach', description: '100% organic spinach, pesticide-free.', price: 70, originalPrice: 90, category: 'Organic', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400', stock: 40, unit: '250g', isFeatured: true },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/greenbasket');
    console.log('✅ MongoDB connected');

    await Product.deleteMany();
    await Product.insertMany(products);
    console.log('✅ Products seeded');

    const adminExists = await User.findOne({ email: 'admin@greenbasket.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'admin@greenbasket.com',
        password: 'admin123',
        isAdmin: true,
      });
      console.log('✅ Admin user created: admin@greenbasket.com / admin123');
    }

    console.log('✅ Seed complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();
