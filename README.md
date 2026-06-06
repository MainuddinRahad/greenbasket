# 🛒 GreenBasket — Food & Grocery E-Commerce (MERN Stack)

## ✅ Features
- Product listing, search & filter by category/price/rating
- Shopping cart (localStorage)
- User login & signup (JWT)
- Wishlist
- Checkout with SSLCommerz payment gateway
- Order tracking with live status
- Product reviews & ratings
- Admin dashboard (products, orders, users, revenue stats)

---

## 🚀 How to Run Locally (VS Code)

### Step 1 — Open Project in VS Code
Unzip the folder and open it in VS Code.

### Step 2 — Start Backend
Open **Terminal 1** in VS Code:
```
cd backend
npm install
npm run seed
npm run dev
```
✅ Backend runs at: http://localhost:5000
✅ Seed creates 12 products + admin account

### Step 3 — Start Frontend
Open **Terminal 2** in VS Code:
```
cd frontend
npm install
npm start
```
✅ Frontend runs at: http://localhost:3000

---

## 🔐 Admin Login
- Email: admin@greenbasket.com
- Password: admin123
- URL: http://localhost:3000/admin

---

## 💳 SSLCommerz Payment Setup
1. Go to https://developer.sslcommerz.com/registration/ and register for a sandbox account (free)
2. Open `backend/.env`
3. Replace:
   - `SSLCOMMERZ_STORE_ID=` → your store ID
   - `SSLCOMMERZ_STORE_PASSWORD=` → your store password
4. Keep `SSLCOMMERZ_IS_LIVE=false` for testing

**Without SSLCommerz credentials:** The site works fully except payment redirect.

---

## 📁 Project Structure
```
greenbasket/
├── backend/
│   ├── config/seed.js        ← Sample data seeder
│   ├── middleware/            ← JWT auth middleware
│   ├── models/                ← MongoDB schemas
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── Wishlist.js
│   ├── routes/                ← API routes
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── wishlistRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── adminRoutes.js
│   ├── .env                   ← Environment variables
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/index.html
    └── src/
        ├── components/
        │   ├── common/ProductCard.js
        │   └── layout/Navbar.js, Footer.js
        ├── context/
        │   ├── AuthContext.js
        │   └── CartContext.js
        ├── pages/
        │   ├── Home.js
        │   ├── Products.js
        │   ├── ProductDetail.js
        │   ├── Cart.js
        │   ├── Checkout.js
        │   ├── Login.js / Signup.js
        │   ├── Wishlist.js
        │   ├── Orders.js
        │   ├── PaymentStatus.js
        │   └── admin/
        │       ├── AdminDashboard.js
        │       └── AdminProductForm.js
        ├── utils/api.js
        ├── App.js
        └── index.js
```

---

## 🌐 Deploy Instructions (Coming Next)
- **Frontend:** Vercel (free)
- **Backend:** Render (free)
- **Database:** MongoDB Atlas (free)

Ask for deploy instructions when ready!
