# TTU DWASO — Campus Marketplace Ghana

<div align="center">
  <img src="frontend/public/favicon.svg" alt="TTU DWASO Logo" width="80" />
  <h3>The Trusted Tertiary Marketplace for Ghanaian Students</h3>
  <p>Buy and sell safely within your own university, nursing college, or teacher training college.</p>

  ![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)
  ![React](https://img.shields.io/badge/React-18-blue?logo=react)
  ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)
  ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-cyan?logo=tailwindcss)
  ![License](https://img.shields.io/badge/License-MIT-yellow)
</div>

---

## Overview

**TTU DWASO** is a production-ready multi-vendor marketplace built exclusively for students across all 16 regions of Ghana. The platform enforces strict **institution-level isolation** — a student at KNUST only sees products listed by vendors registered at KNUST, and so on.

### Key Features

- 🎓 **Institution-Locked Marketplace** — Products visible only within the same institution
- 🏥 **3 Institution Types** — Universities, Nursing Training Colleges, Teacher Training Colleges
- 🛡️ **Verified Vendors** — Ghana Card + Passport verification with admin approval
- 🗺️ **All 16 Ghana Regions** — Complete dynamic region → institution cascade
- 💬 **Real-time Chat** — Socket.io powered in-app messaging
- 👨‍💼 **Admin Dashboard** — Full platform management with analytics
- 📱 **Fully Responsive** — Mobile-first design with dark mode
- 🔐 **Secure Auth** — JWT + bcrypt + role-based access control
- ☁️ **Cloud Storage** — Cloudinary for all image uploads
- 🚀 **Deployment-Ready** — Vercel (frontend) + Render/Railway (backend)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion |
| **State** | React Context API |
| **Forms** | React Hook Form |
| **HTTP** | Axios |
| **Routing** | React Router v6 |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas, Mongoose |
| **Auth** | JWT, bcrypt |
| **File Uploads** | Cloudinary, Multer |
| **Real-time** | Socket.io |
| **Security** | Helmet, express-rate-limit |

---

## User Roles

| Role | Description |
|------|-------------|
| **Student** | Browses and contacts vendors within their institution |
| **Vendor** | Lists products for sale; requires admin approval |
| **Admin** | Full platform management, user & product moderation |

---

## Project Structure

```
TTU_DWASO/
├── backend/
│   ├── config/
│   │   ├── db.js               # MongoDB connection
│   │   └── cloudinary.js       # Cloudinary + Multer setup
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── regionController.js
│   │   ├── adminController.js
│   │   └── messageController.js
│   ├── middleware/
│   │   ├── auth.js             # JWT + role middleware
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Region.js
│   │   └── Message.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── regions.js
│   │   ├── vendors.js
│   │   ├── admin.js
│   │   ├── upload.js
│   │   └── messages.js
│   ├── utils/
│   │   └── seed.js             # DB seeder (regions + admin)
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   └── common/
│   │   │       ├── Navbar.jsx
│   │   │       ├── Sidebar.jsx
│   │   │       ├── ProductCard.jsx
│   │   │       ├── ImageUploader.jsx
│   │   │       ├── RegionInstitutionSelect.jsx
│   │   │       ├── ProtectedRoute.jsx
│   │   │       ├── Loader.jsx
│   │   │       └── Modal.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/
│   │   │   ├── public/         # HomePage, ProductDetailsPage, NotFoundPage
│   │   │   ├── auth/           # LoginPage, RegisterPage
│   │   │   ├── student/        # StudentDashboard, BrowseProducts
│   │   │   ├── vendor/         # VendorDashboard, AddProduct, EditProduct, MyProducts
│   │   │   ├── admin/          # AdminDashboard, VendorApproval, UserManagement, etc.
│   │   │   └── shared/         # MessagesPage
│   │   ├── utils/
│   │   │   ├── api.js          # Axios instance
│   │   │   └── helpers.js      # Formatters, constants
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── .gitignore
├── package.json
└── README.md
```

---

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Cloudinary account

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd TTU_DWASO
npm run install:all
```

### 2. Configure Environment Variables

**Backend** — copy and fill in:
```bash
cp backend/.env.example backend/.env
```

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/ttu_dwaso
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=admin@ttudwaso.edu.gh
ADMIN_PASSWORD=Admin@TTU2024!
```

**Frontend** — copy and fill in:
```bash
cp frontend/.env.example frontend/.env
```

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_APP_NAME=TTU DWASO
```

### 3. Seed the Database

This populates all 16 Ghana regions with institutions and creates the admin account:

```bash
npm run seed
```

Expected output:
```
✅ Connected to MongoDB
🗑️  Cleared existing regions
✅ Inserted 16 regions with institutions
✅ Admin account created
   Email: admin@ttudwaso.edu.gh
   Password: Admin@TTU2024!
```

### 4. Run Locally

```bash
# Terminal 1 — Backend
npm run dev:backend

# Terminal 2 — Frontend
npm run dev:frontend
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Health check: http://localhost:5000/api/health

---

## MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free cluster (M0)
3. Create a database user with read/write access
4. Whitelist your IP (or `0.0.0.0/0` for all)
5. Get your connection string from **Connect → Connect your application**
6. Paste into `MONGODB_URI` in `backend/.env`

---

## Cloudinary Setup

1. Go to [Cloudinary](https://cloudinary.com) and create a free account
2. From your dashboard, copy:
   - **Cloud Name**
   - **API Key**
   - **API Secret**
3. Paste into `backend/.env`

> Cloudinary free tier: 25 GB storage, 25 GB bandwidth/month — sufficient for development and small production.

---

## API Documentation

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | None | Register student or vendor |
| POST | `/api/auth/login` | None | Login and get JWT |
| GET | `/api/auth/me` | JWT | Get current user |
| PUT | `/api/auth/profile` | JWT | Update profile |
| PUT | `/api/auth/change-password` | JWT | Change password |

### Regions

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/regions` | None | Get all regions |
| GET | `/api/regions/full` | None | All regions with institutions |
| GET | `/api/regions/:id/institutions` | None | Institutions in a region |
| POST | `/api/regions` | Admin | Create region |
| POST | `/api/regions/:id/institutions` | Admin | Add institution |
| DELETE | `/api/regions/:rid/institutions/:iid` | Admin | Remove institution |

### Products

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products` | Optional | Browse products (institution-filtered for students) |
| POST | `/api/products` | Vendor | Create product listing |
| GET | `/api/products/:id` | Optional | Get product details |
| PUT | `/api/products/:id` | Vendor/Admin | Update product |
| DELETE | `/api/products/:id` | Vendor/Admin | Delete product |
| GET | `/api/products/my-products` | Vendor | Get own products |

### Admin

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/dashboard` | Admin | Platform stats |
| GET | `/api/admin/vendors/pending` | Admin | Pending vendor applications |
| PUT | `/api/admin/vendors/approve/:id` | Admin | Approve vendor |
| PUT | `/api/admin/vendors/reject/:id` | Admin | Reject vendor |
| PUT | `/api/admin/users/suspend/:id` | Admin | Suspend user |
| GET | `/api/admin/users` | Admin | List all users |
| DELETE | `/api/admin/users/:id` | Admin | Delete user |
| GET | `/api/admin/products/flagged` | Admin | Flagged products |
| PUT | `/api/admin/products/unflag/:id` | Admin | Unflag product |
| DELETE | `/api/admin/products/:id` | Admin | Delete product |

### Messages

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/messages/inbox` | JWT | Get all conversations |
| GET | `/api/messages/conversation/:userId` | JWT | Get conversation messages |
| POST | `/api/messages` | JWT | Send message |

---

## Deployment

### Frontend → Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) → New Project
3. Import your repository
4. Set **Root Directory** to `frontend`
5. Add environment variables:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   VITE_SOCKET_URL=https://your-backend.onrender.com
   ```
6. Deploy ✅

### Backend → Render

1. Go to [Render](https://render.com) → New Web Service
2. Connect your GitHub repo
3. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Node Version**: 18
4. Add all environment variables from `backend/.env.example`
5. Set `NODE_ENV=production`
6. Deploy ✅

### Backend → Railway (Alternative)

1. Go to [Railway](https://railway.app) → New Project → Deploy from GitHub
2. Select your repo
3. Add environment variables
4. Railway auto-detects Node.js — just set the `backend` folder as root
5. Deploy ✅

---

## Product Categories

- 📚 Books
- 💻 Electronics
- 🪑 Furniture
- 👕 Clothes
- 🍱 Food
- 🩺 Nursing/Medical Supplies
- ✏️ Teaching Materials
- 🛍️ Others

---

## Ghana Regions Covered

All **16 regions** with universities, nursing colleges, and teacher training colleges:

Greater Accra · Ashanti · Western · Western North · Central · Eastern · Volta · Oti · Bono · Bono East · Ahafo · Northern · Savannah · North East · Upper East · Upper West

---

## Security Features

- 🔐 Password hashing with bcrypt (12 salt rounds)
- 🎟️ JWT with configurable expiration
- 🛡️ Helmet.js security headers
- ⏱️ Rate limiting on API and auth routes
- 📁 File type and size validation
- 🏛️ Role-based access control (RBAC)
- 🔒 Institution isolation enforced server-side

---

## License

MIT License — © 2024 TTU DWASO

---

<div align="center">
  <p>Built with ❤️ for Ghanaian Students</p>
  <p>🇬🇭 Ghana's Campus Marketplace</p>
</div>
