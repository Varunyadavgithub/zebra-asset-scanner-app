import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import Routes from "./routes/index.js";

dotenv.config();

const app = express();

// Parse JSON bodies
app.use(express.json());

// Allow all origins (works for Expo, Postman, mobile apps, and web)
app.use(
  cors({
    origin: true, // allow any origin
    credentials: true,
  }),
);

// Optional: log all incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api/v1", Routes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
