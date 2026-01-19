import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import Routes from "./routes/index.js";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  }),
);

app.use("/api/v1", Routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
