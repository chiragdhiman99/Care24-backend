<div align="center">

<img src="https://img.shields.io/badge/Care24-Backend%20API-green?style=for-the-badge&logo=node.js&logoColor=white" alt="Care24 Backend"/>

# ⚙️ Care24 — Backend API

### *Robust REST API + Real-time Server powering the Care24 Platform*

[![Node.js](https://img.shields.io/badge/Node.js-Express%205-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%209-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.x-010101?style=flat-square&logo=socket.io)](https://socket.io/)
[![JWT](https://img.shields.io/badge/Auth-JWT%20%2B%20Google%20OAuth-FF6C37?style=flat-square&logo=jsonwebtokens)](https://jwt.io/)
[![Razorpay](https://img.shields.io/badge/Payments-Razorpay-0C2461?style=flat-square&logo=razorpay)](https://razorpay.com/)
[![Frontend](https://img.shields.io/badge/Frontend%20Repo-Care24-blue?style=flat-square&logo=github)](https://github.com/chiragdhiman99/Care24-frontend)

</div>

---

## 📌 Overview

This is the **backend server** for [Care24](https://github.com/chiragdhiman99/Care24-frontend) — an elderly care management platform. It exposes a **RESTful API** and a **Socket.io real-time server** to power three user roles: **Family**, **Caregiver**, and **Admin**.

Key highlights:
- 🔐 Secure auth with **JWT + Google OAuth 2.0**
- 💳 Payment integration via **Razorpay**
- 📡 Real-time communication with **Socket.io**
- 📧 Email notifications via **Nodemailer + Resend**
- 📁 File upload support via **Multer**
- ⏰ Scheduled tasks via **node-cron**

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Runtime** | Node.js |
| **Framework** | Express 5 |
| **Database** | MongoDB + Mongoose 9 |
| **Real-time** | Socket.io 4 |
| **Authentication** | JWT + Passport.js (Google OAuth 2.0) |
| **Payments** | Razorpay |
| **Email** | Nodemailer + Resend |
| **File Uploads** | Multer |
| **Validation** | express-validator |
| **Security** | bcryptjs, express-rate-limit, cookie-parser |
| **Scheduler** | node-cron |
| **Dev Tool** | Nodemon |

---

## 📁 Project Structure

```
Care24-backend/
├── src/
│   ├── config/             # DB connection, passport config
│   ├── controllers/        # Business logic for each module
│   │   ├── auth/
│   │   ├── booking/
│   │   ├── caregiver/
│   │   ├── chat/
│   │   ├── healthRecord/
│   │   ├── notification/
│   │   ├── payment/
│   │   └── user/
│   ├── middleware/         # Auth, error handling, rate limiting
│   ├── models/             # Mongoose schemas
│   ├── routes/             # Express route definitions
│   ├── socket/             # Socket.io event handlers
│   └── utils/              # Email, helpers, cron jobs
├── uploads/                # Multer file storage
├── images/caregivers/      # Caregiver profile images
├── server.js               # Entry point
├── seed.js                 # DB seeder script
└── package.json
```

---

## 🔑 Core Modules & API Overview

### 🔐 Authentication
- `POST /api/auth/register` — Register new user (Family / Caregiver)
- `POST /api/auth/login` — Login with email & password (JWT issued)
- `GET  /api/auth/google` — Google OAuth login
- `GET  /api/auth/google/callback` — Google OAuth callback
- `POST /api/auth/logout` — Logout & clear session
- `POST /api/auth/forgot-password` — Send password reset email
- `POST /api/auth/reset-password` — Reset password with token

### 👨‍👩‍👧 Family / User
- `GET  /api/user/profile` — Get user profile
- `PUT  /api/user/profile` — Update user profile
- `GET  /api/user/appointments` — View all appointments
- `GET  /api/user/health-records` — Fetch health records
- `POST /api/user/health-records` — Add a new health record

### 🧑‍⚕️ Caregiver
- `POST /api/caregiver/apply` — Submit caregiver application (with profile image upload)
- `GET  /api/caregiver/profile` — Get caregiver profile
- `PUT  /api/caregiver/profile` — Update profile
- `GET  /api/caregiver/bookings` — View assigned bookings
- `PUT  /api/caregiver/bookings/:id` — Accept / update booking status

### 📅 Bookings
- `POST /api/bookings` — Create a new caregiver booking
- `GET  /api/bookings/:id` — Get booking details
- `PUT  /api/bookings/:id/cancel` — Cancel a booking

### 💳 Payments (Razorpay)
- `POST /api/payment/create-order` — Create Razorpay payment order
- `POST /api/payment/verify` — Verify payment signature & confirm booking

### 💬 Chat (Real-time via Socket.io)
- `GET  /api/chat/:conversationId` — Fetch chat history
- `POST /api/chat/send` — Send a message (also emits via socket)

### 🔔 Notifications
- `GET  /api/notifications` — Get all notifications for logged-in user
- `PUT  /api/notifications/:id/read` — Mark notification as read
- `PUT  /api/notifications/read-all` — Mark all as read

### 🛡️ Admin
- `GET  /api/admin/users` — List all users
- `PUT  /api/admin/users/:id` — Update / deactivate user
- `GET  /api/admin/caregivers` — List all caregivers
- `PUT  /api/admin/caregivers/:id/approve` — Approve caregiver application
- `GET  /api/admin/bookings` — View all platform bookings
- `PUT  /api/admin/bookings/:id` — Manage booking status

---

## ⚡ Real-Time Events (Socket.io)

| Event | Direction | Description |
|-------|-----------|-------------|
| `join_room` | Client → Server | Join a chat/notification room |
| `send_message` | Client → Server | Send a chat message |
| `receive_message` | Server → Client | Deliver new message to recipient |
| `new_notification` | Server → Client | Push live notification to user |
| `booking_update` | Server → Client | Real-time booking status change |

---

## 🚀 Getting Started

### Prerequisites

- Node.js `>= 18`
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- Razorpay account (for payment features)
- Google Cloud project (for OAuth)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/chiragdhiman99/Care24-backend.git

# 2. Navigate to the project directory
cd Care24-backend

# 3. Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/care24

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# Session
SESSION_SECRET=your_session_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Email (Nodemailer / Resend)
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=noreply@care24.com

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173
```

### Running the Server

```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

Server runs at **`http://localhost:5000`** 🚀

### Seeding the Database

To populate the database with sample data:

```bash
node seed.js
```

---

## 🔒 Security Features

- **Password hashing** with `bcryptjs`
- **JWT-based** stateless authentication
- **Rate limiting** on all API routes via `express-rate-limit`
- **Input validation** with `express-validator`
- **CORS** configured for frontend origin only
- **Cookie-parser** for secure session management
- **Response compression** for performance

---

## ⏰ Scheduled Tasks (node-cron)

Automated background jobs include:
- Sending booking reminder emails before appointment time
- Auto-expiring pending bookings after timeout
- Cleaning up old notifications periodically

---

## 🔗 Frontend Repository

This is the **backend** of Care24. The frontend (React + Vite) is maintained separately.

🖥️ **Frontend Repo:** [https://github.com/chiragdhiman99/Care24-frontend](https://github.com/chiragdhiman99/Care24-frontend)

🌐 **Live App:** [https://care24-frontend-tjrg.vercel.app/](https://care24-frontend-tjrg.vercel.app/)

---

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License**.

---

<div align="center">

Made with ❤️ by [Chirag Dhiman](https://github.com/chiragdhiman99)

⭐ Star this repo if you found it helpful!

</div>
