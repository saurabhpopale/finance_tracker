# Production Deployment Guide

This guide provides step-by-step instructions for deploying the **Finance Tracker** full-stack application to production.

---

## Dummy URLs Configured

The codebase is currently configured with the following dummy production URLs:

| Service | Environment Variable | Current Dummy URL |
| :--- | :--- | :--- |
| **Backend API** | `VITE_API_URL` (in frontend) | `https://dummy-finance-tracker-api.onrender.com` |
| **Frontend App** | `FRONTEND_URL` (in backend) | `https://dummy-finance-tracker.vercel.app` |

You will replace these placeholder URLs with your live production URLs during deployment.

---

## Prerequisites Before Deployment

1. **GitHub Account**: Push this repository to your GitHub account.
2. **MongoDB Atlas Database**:
   - Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
   - Under **Database Access**, create a database user and note the password.
   - Under **Network Access**, click **Add IP Address** and select **Allow Access from Anywhere** (`0.0.0.0/0`) because cloud hosting platforms (Render, Railway, etc.) use dynamic IPs.
   - Click **Connect** -> **Drivers** -> Copy your connection string (e.g., `mongodb+srv://<user>:<password>@cluster0.xxx.mongodb.net/finance_tracker?retryWrites=true&w=majority`).
3. **Gmail App Password (for OTP Emails)**:
   - In your Google Account, enable **2-Step Verification**.
   - Navigate to **Security** -> **App Passwords**.
   - Generate an app password for "Mail" (16 characters, e.g., `abcd efgh ijkl mnop`).

---

## Step 1: Deploy Backend (Render / Railway)

### Option A: Deploy on Render (Recommended)

1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** -> **Web Service**.
2. Connect your GitHub repository.
3. Configure the service settings:
   - **Name**: `finance-tracker-api` (or your choice)
   - **Region**: Choose the region closest to you / your users
   - **Branch**: `main` (or `master`)
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Under **Environment Variables**, add the following:

   | Key | Value | Description |
   | :--- | :--- | :--- |
   | `NODE_ENV` | `production` | Enables production mode & cross-origin cookies |
   | `PORT` | `8000` | (Render automatically sets `PORT`, or use `8000`) |
   | `MONGODB_URI` | `mongodb+srv://...` | Your real MongoDB Atlas connection string |
   | `JWT_SECRET` | `your-secure-random-32-char-secret` | Random secret key for signing JWT tokens |
   | `FRONTEND_URL` | `https://dummy-finance-tracker.vercel.app` | Temporary dummy frontend URL (update in Step 3) |
   | `EMAIL_USER` | `your-email@gmail.com` | Your Gmail address |
   | `EMAIL_PASS` | `xxxx xxxx xxxx xxxx` | 16-character Gmail App Password |

5. Click **Create Web Service**.
6. Render will build and deploy your backend.
7. Once deployed, copy your backend URL:
   - Example: `https://finance-tracker-api-xxxx.onrender.com`
   - Test it by visiting `https://finance-tracker-api-xxxx.onrender.com/health` in your browser. You should receive:
     ```json
     { "status": "ok", "environment": "production", "timestamp": "..." }
     ```

---

## Step 2: Deploy Frontend (Vercel / Netlify)

### Option A: Deploy on Vercel (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New...** -> **Project**.
2. Import your GitHub repository.
3. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click edit and select `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Expand **Environment Variables** and add:

   | Key | Value |
   | :--- | :--- |
   | `VITE_API_URL` | `https://finance-tracker-api-xxxx.onrender.com` *(paste your real Backend URL from Step 1 without trailing slash)* |

5. Click **Deploy**.
6. Once deployment finishes, copy your live frontend URL:
   - Example: `https://finance-tracker-frontend.vercel.app`

---

## Step 3: Link Backend with Live Frontend URL

Now that you have your live frontend URL:

1. Return to the **Render Dashboard** for your backend service.
2. Go to **Environment Variables**.
3. Update `FRONTEND_URL`:
   - Change from: `https://dummy-finance-tracker.vercel.app`
   - To: `https://finance-tracker-frontend.vercel.app` *(your real live frontend URL without trailing slash)*
4. Save changes. Render will automatically redeploy the backend with the updated CORS origin.

---

## Summary of Environment Variables

### Backend (`backend/.env`)

```env
PORT=8000
NODE_ENV=production
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/finance_tracker?retryWrites=true&w=majority
JWT_SECRET=super_secret_jwt_key_here_change_in_production
FRONTEND_URL=https://your-frontend-app.vercel.app
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

### Frontend (`frontend/.env.production`)

```env
VITE_API_URL=https://your-backend-api.onrender.com
```

---

## Production Architecture Notes

- **Cross-Origin Authentication**: The backend is configured to use `sameSite: "none"` and `secure: true` in production (`NODE_ENV === "production"`), ensuring JWT cookies are accepted by browsers when frontend and backend are hosted on separate domains (e.g. Vercel and Render).
- **Reverse Proxy Support**: `app.set("trust proxy", 1)` is enabled in Express to properly handle secure cookie delivery behind Render, Railway, or AWS reverse proxies.
- **SPA Routing**: `frontend/vercel.json` and `frontend/public/_redirects` are included to guarantee direct navigation and page reloads work smoothly without 404 errors.
- **CORS Support**: Supports single or comma-separated origins in `FRONTEND_URL` and trims trailing slashes to avoid CORS mismatch issues.
