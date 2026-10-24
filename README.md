# Personal Finance Tracker

A full-stack, production-ready personal finance and expense tracking web application built with **React**, **TypeScript**, **Node.js**, **Express**, and **MongoDB**.

---

## Features

- 🔐 **Authentication & Security**:
  - Secure JWT authentication stored in HTTP-only, cross-origin cookies
  - Dual support for HTTP-only cookies and `Authorization: Bearer <token>` headers
  - Email verification & password reset via 6-digit OTPs (Nodemailer)
  - Password hashing with Bcrypt
- 💰 **Transaction & Expense Management**:
  - Add, edit, view, and delete income and expense transactions
  - Categorization and date tracking
- 📊 **Visual Analytics & Reports**:
  - Financial charts and dashboards using Recharts
- 🚀 **Production Ready**:
  - Configured for multi-platform deployment (Vercel / Netlify for frontend, Render / Railway for backend)
  - Pre-configured CORS, reverse proxy trust (`trust proxy`), and SPA client routing (`_redirects` & `vercel.json`)
  - Sanitized environment variable configuration and `.gitignore` preventing credential leaks

---

## Project Structure

```
Finance_Tracker/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration (MongoDB)
│   │   ├── controllers/     # Auth and Transaction controllers
│   │   ├── middlewares/     # JWT authentication middleware
│   │   ├── models/          # Mongoose data models (User, Transaction)
│   │   ├── routes/          # Express API route handlers
│   │   ├── services/        # Business logic services
│   │   ├── types/           # TypeScript definitions
│   │   ├── utils/           # Helper utilities (token, email)
│   │   ├── app.ts           # Express application setup & middleware
│   │   └── server.ts        # Server entrypoint with graceful shutdown
│   ├── .env.example         # Example environment variables (dummy values)
│   ├── .gitignore           # Backend-specific ignore rules
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── public/              # Static assets & SPA routing (_redirects)
│   ├── src/
│   │   ├── components/      # UI components & route guards
│   │   ├── hooks/           # Redux hooks
│   │   ├── pages/           # Application views (Dashboard, Login, etc.)
│   │   ├── services/        # Axios API client & endpoints
│   │   ├── store/           # Redux Toolkit state slices
│   │   ├── types/           # TypeScript definitions
│   │   ├── App.tsx          # Router configuration
│   │   └── main.tsx         # React entrypoint
│   ├── .env.example         # Example frontend environment variables
│   ├── .env.production      # Production default with dummy backend URL
│   ├── .gitignore           # Frontend-specific ignore rules
│   ├── package.json
│   ├── vercel.json          # Vercel SPA routing rewrite rules
│   └── vite.config.ts
│
├── .gitignore               # Root gitignore (blocks all .env and node_modules)
├── DEPLOYMENT.md            # Detailed production deployment guide
├── package.json             # Root scripts to build/install both services
└── README.md
```

---

## Getting Started Locally

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/Finance_Tracker.git
cd Finance_Tracker
```

### 2. Install Dependencies
```bash
npm run install:all
```

### 3. Setup Environment Variables

**Backend (`backend/.env`):**
```env
PORT=8000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

**Frontend (`frontend/.env`):**
```env
VITE_API_URL=http://localhost:8000
```

### 4. Run Development Servers

In one terminal (backend):
```bash
npm run dev:backend
```

In another terminal (frontend):
```bash
npm run dev:frontend
```

---

## Production Deployment

Detailed deployment instructions are documented in [DEPLOYMENT.md](./DEPLOYMENT.md).

### Placeholder / Dummy URLs Configured:
- **Backend API**: `https://dummy-finance-tracker-api.onrender.com`
- **Frontend App**: `https://dummy-finance-tracker.vercel.app`

### Quick Deployment Steps:
1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Production ready setup with dummy URLs"
   git branch -M main
   git remote add origin https://github.com/<your-username>/Finance_Tracker.git
   git push -u origin main
   ```
2. **Deploy Backend on Render**:
   - Set Root Directory to `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Set environment variables (`MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL`, `EMAIL_USER`, `EMAIL_PASS`, `NODE_ENV=production`)
3. **Deploy Frontend on Vercel**:
   - Set Root Directory to `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Set `VITE_API_URL` to your live Render backend URL
4. **Update Backend CORS**:
   - Update `FRONTEND_URL` on Render to your live Vercel URL
