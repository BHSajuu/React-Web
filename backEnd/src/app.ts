import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import userRoutes from "./routes/userRoutes";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend's URL
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
); // Adjust the port to match your frontend

// Middleware
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
// Routes
app.use("/api/v1", userRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

export default app;
