# Planora Backend API 🚀

Planora is a comprehensive full-stack events management platform. This repository contains the backend REST API built with modern Node.js tools, providing a secure, scalable, and robust foundation for the platform.

## 🛠️ Technology Stack
- **Framework**: Node.js with Express.js
- **Database**: PostgreSQL (Hosted on Neon)
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens) & Google OAuth 2.0 (Passport.js)
- **Payment Gateway**: SSLCommerz (Sandbox/Production support)
- **File Storage**: Cloudinary (for event covers and user avatars)
- **Validation**: Zod
- **Security**: Helmet, CORS, bcryptjs
- **Deployment**: Vercel (Serverless Functions)

---

## ✨ Key Features
- **Role-Based Access Control (RBAC)**: Distinct permissions for `ADMIN`, `OWNER`, and `USER`.
- **Advanced Event Management**: Full CRUD operations with support for public and private (invite-only) events.
- **Dynamic Search & Filtering**: Filter events by status, price, category, and date ranges.
- **Payment Integration**: Seamless BDT transactions via SSLCommerz for paid event registrations.
- **Social Auth**: Quick login/signup with Google OAuth.
- **Reviews System**: Participants can leave reviews with a 24-hour edit window.
- **Admin Moderation**: Comprehensive admin capabilities to delete users and moderate events.

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- Node.js (v18+)
- PostgreSQL database
- SSLCommerz Store ID & Password
- Cloudinary Account
- Google Cloud Console Project (for OAuth)

### 2. Installation
```bash
git clone <repository-url>
cd backend
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
PORT=4000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/planora
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=30d
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:4000

# Social Auth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Payments
SSL_STORE_ID=your_store_id
SSL_STORE_PASS=your_store_pass
IS_SANDBOX=true

# Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Database Setup & Seeding
Push the Prisma schema to your database and seed it with initial data:
```bash
npx prisma db push
npx prisma db seed
```
**Seed Accounts:**
- **Admin**: `admin@planora.com` / `password123`
- **Owner**: `owner@planora.com` / `password123`
- **User**: `john@example.com` / `password123`

### 5. Running the Application
```bash
npm run dev     # Starts the development server with hot-reload
npm run build   # Compiles TypeScript to JavaScript
npm start       # Runs the compiled production build
```

---

## ☁️ Deployment (Vercel)
This backend is optimized for Vercel Serverless deployments.
1. Connect the repository to Vercel.
2. In Vercel Project Settings > General, set the **Build Command** to: `npm run build`
3. Add all the environment variables from your `.env` file into Vercel.
4. Deploy! Vercel will automatically compile the TypeScript and serve the API via `vercel.json` rewrites.

---

## 📚 API Documentation
For detailed API documentation, including request/response test cases, please refer to the [API_DOCUMENTS.md](./API_DOCUMENTS.md) file.
