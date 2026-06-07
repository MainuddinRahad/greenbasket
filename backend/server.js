const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (process.env.NODE_ENV !== 'production') return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.get('/', (req, res) => {
  res.json({ message: '🛒 GreenBasket API is running!' });
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Server Error' });
});

const atlasUri = process.env.MONGO_URI;
const localUri = 'mongodb://127.0.0.1:27017/greenbasket';
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    if (atlasUri) {
      await mongoose.connect(atlasUri);
      console.log('✅ MongoDB connected: atlas');
    } else {
      throw new Error('No Atlas URI provided');
    }
  } catch (atlasError) {
    console.error('❌ Atlas connection failed:', atlasError.message);
    try {
      await mongoose.connect(localUri);
      console.log('✅ MongoDB connected: local fallback');
    } catch (localError) {
      console.error('❌ Local MongoDB connection failed:', localError.message);
      process.exit(1);
    }
  }

  const Product = require('./models/Product');
  const User = require('./models/User');
  const bcrypt = require('bcryptjs');
  const count = await Product.countDocuments();

  const adminExists = await User.findOne({ email: 'admin@greenbasket.com' });
  if (!adminExists) {
    const hashed = await bcrypt.hash('admin123', 10);
    await User.create({ name: 'Admin', email: 'admin@greenbasket.com', password: hashed, isAdmin: true });
    console.log('✅ Admin created');
  }

  const maxPortAttempts = 5;
  let currentPort = PORT;

  const listenWithRetry = () => {
    const server = app.listen(currentPort, () => {
      console.log(`✅ Server running at http://localhost:${currentPort}`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE' && currentPort < PORT + maxPortAttempts) {
        console.warn(`⚠️ Port ${currentPort} already in use, trying ${currentPort + 1}...`);
        currentPort += 1;
        listenWithRetry();
      } else {
        console.error('❌ Server failed to start:', err.message);
        process.exit(1);
      }
    });
  };

  listenWithRetry();
};

startServer();
