# ⚡ RigForge — Custom PC Parts E-Commerce & Battle Rig Builder

RigForge is a modern, full-stack custom PC hardware e-commerce and interactive PC builder application tailored for the Indian gaming and workstation market.

![RigForge Banner](public/images/rigforge-logo.png)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Mrphysico/RigForge)

---

## 🌟 Key Features

### 🖥️ 1. Interactive Custom PC Builder
- **Real-Time Compatibility Engine**: Dynamically matches CPU sockets (LGA1700, AM5, AM4) with motherboards, validates DDR4/DDR5 RAM, and computes clearance.
- **Dynamic Power Budget Calculator**: Calculates system TDP wattage in real-time and recommends appropriate 80+ Bronze/Gold/Platinum PSUs with safe headroom.
- **Estimated Gaming Performance Benchmark**: Instant visual FPS estimators for popular titles (Cyberpunk 2077, Valorant, GTA V) at 1080p, 1440p, and 4K.

### 🇮🇳 2. Indian Hardware Catalog & Retail Benchmarking
- **Indian Pricing & Localization**: All prices formatted in Indian Rupees (`₹` / INR) with GST calculations.
- **Catalog Dataset**: Features popular components sold across Indian retailers (MDComputers, Vedant Computers, PrimeABGB, EliteHubs).
- **Out-of-Stock Badging & Stock Counters**: Clear inventory alerts and restock badges.

### 💳 3. Interactive UPI QR Payment Gateway
- **Direct UPI Settlement**:
  - **Beneficiary**: Arth Rakesh Jadav
  - **UPI ID**: `9819319689@nyes`
  - **Settlement Bank**: Bank of India
  - **QR Code Asset**: Dynamically generated and served locally from `/images/upi-qr.jpg`.
- **Integrated Checkout Flow**:
  - **Step 1**: Order review with subtotal, 18% GST breakdown, and BlueDart shipping calculations.
  - **Step 2**: Scan & Pay window with 1-click UPI ID copying, NPCI badge, and accepted app indicators (GPay, PhonePe, Paytm, Navi).
  - **Step 3**: Strict 12-digit UPI Reference / UTR Number validation (`^\d{12}$`) with optional receipt upload.
  - **Step 4**: Animated confirmation with tracking docket number (`RF-IN-XXXXXX`).

### ⏱️ 4. 30-Minute Inactivity Auto-Logout & Session Security
- **Inactivity Tracker**: Listens to user interactions (`mousemove`, `mousedown`, `keydown`, `scroll`, `touchstart`).
- **Strict 30-Minute Threshold**: Automatically terminates session and clears JWT tokens after 30 minutes of idle time.
- **Cross-Tab Synchronization**: Inactivity is synchronized across open tabs using `storage` events.
- **Security Notification Dialog**: Explains session expiry while preserving local cart and draft builds.

### ✉️ 5. Automated Welcome Email Dispatch
- **Automated Dispatch**: Immediately sends an account confirmation email upon registration.
- **Email Details**:
  - **Recipient**: Arth Jadav (`jadavarth07@gmail.com`)
  - **Subject**: `🎉 Welcome to RigForge! Your Account has been Successfully Created`
  - **Highlights**: Official brand warranty, insured air courier, and zero-fee UPI payments.

---

## 🛠️ Architecture & Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS (Dark gaming neon aesthetic: zinc `#09090b` + cyan/neon accents)
- **State Management**: Zustand
- **Icons**: Lucide React
- **Email Service**: `@emailjs/browser`

### Backend (`server/`)
- **Runtime**: Node.js + Express (TypeScript)
- **Database**: MongoDB (Mongoose) with an automatic in-memory data store fallback
- **Authentication**: JWT (strict 30-minute expiration) & bcrypt password hashing
- **Email Engine**: Nodemailer (HTML & plain-text templates)
- **Port**: `5000` (CORS enabled for `http://localhost:5173`)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+ recommended)
- npm (v9+)
- MongoDB (optional; server automatically uses resilient in-memory storage if MongoDB is offline)

### 2. Installation

Clone the repository:
```bash
git clone https://github.com/Mrphysico/RigForge.git
cd RigForge
```

Install frontend dependencies:
```bash
npm install
```

Install backend dependencies:
```bash
cd server
npm install
cd ..
```

### 3. Environment Setup

#### Frontend (`.env`):
```env
VITE_GOOGLE_CLIENT_ID=
VITE_FACEBOOK_APP_ID=
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
```

#### Backend (`server/.env`):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/rigforge
JWT_SECRET=rigforge_secure_jwt_secret_token_2026_key
JWT_EXPIRES_IN=30m

# Nodemailer SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=jadavarth07@gmail.com
SMTP_PASS=
SMTP_FROM="RigForge India" <jadavarth07@gmail.com>
```

### 4. Running the Application

Start backend server (Port 5000):
```bash
npm run server:dev
```

Start frontend client (Port 5173):
```bash
npm run dev
```

Visit **`http://localhost:5173`** in your browser!

---

## 📦 Build for Production

```bash
# Build frontend
npm run build

# Build backend
npm run server:build
```

---

## 📄 License
This project is licensed under the MIT License.
