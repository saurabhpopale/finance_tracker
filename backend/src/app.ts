import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import transactionRouter from "./routes/transaction.routes.js";

const app = express();

// Trust reverse proxy (required for secure cookies behind Render, Railway, Heroku, AWS, Cloudflare, etc.)
app.set("trust proxy", 1);

// Build allowed origins list from environment variable and local defaults
const defaultOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://dummy-finance-tracker.vercel.app",
];

const envOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",")
      .map((url) => url.trim().replace(/\/+$/, ""))
      .filter(Boolean)
  : [];

const allowedOrigins = Array.from(new Set([...defaultOrigins, ...envOrigins]));

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman, server-to-server)
      if (!origin) {
        return callback(null, true);
      }
      const normalizedOrigin = origin.replace(/\/+$/, "");
      if (
        allowedOrigins.includes(normalizedOrigin) ||
        process.env.NODE_ENV !== "production"
      ) {
        return callback(null, true);
      }
      return callback(
        new Error(`CORS blocked: Origin ${origin} not in allowed origins list`)
      );
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

app.use(express.json());
app.use(cookieParser());

// Health check endpoint for deployment platforms & uptime monitors
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (req, res) => {
  res.json({
    message: "Finance Manager API is running",
    status: "healthy",
  });
});

app.use("/api/auth", authRouter);
app.use("/api/transaction", transactionRouter);

// Central error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("API error:", err.message || err);
    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
);

export default app;
