# Planora Backend 🚀

Planora is a full-stack events platform. This repository contains the backend API built with **Node.js**, **Express**, **Prisma**, and **PostgreSQL**.

## 🛠️ Features
- **Auth**: JWT-based Authentication with Role-Based Access Control (RBAC).
- **Events**: CRUD operations, advanced search, filtering, and pagination.
- **Participation**: Join free events or pay for tickets via Stripe.
- **Invitations**: Private event invitation system.
- **Reviews**: Participant reviews with a 24-hour edit window.
- **Admin**: Moderation endpoints for users and events.

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- PostgreSQL database (or Neon/Supabase)
- Stripe Account (for payments)

### 2. Installation
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory (use `.env.example` as a template):
```env
DATABASE_URL=
JWT_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
FRONTEND_URL=http://localhost:3000
```

### 4. Database Setup & Seeding
```bash
npx prisma migrate dev
npx prisma db seed
```
*Current Seed Credentials:*
- **Admin**: `admin@planora.com` / `password123`
- **Owner**: `owner@planora.com` / `password123`
- **User**: `john@example.com` / `password123`

### 5. Running the App
```bash
npm run dev   # Development (with auto-reload)
npm run build # Build for production
npm start     # Run production build
```

## 📜 API Documentation Overview
| Endpoint | Method | Description | Auth |
|---|---|---|---|
| `/auth/register` | POST | Create a new user | Public |
| `/auth/login` | POST | Get JWT token | Public |
| `/events` | GET | List public events | Public |
| `/events/:id` | GET | View event details | Public |
| `/events/:id/join` | POST | Join a free event | Auth |
| `/payments/checkout` | POST | Create Stripe session | Auth |
| `/admin/users` | GET | List all users | Admin |

## 🧪 Testing Webhooks Locally
Use the Stripe CLI to forward events:
```bash
stripe listen --forward-to localhost:4000/payments/webhook
```
