import "dotenv/config";
import express from "express";
import cors from "cors";
import { pool } from "./db.js";
import hotelRoutes from "./routes/hotels.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/api/health", async (req, res) => {
  await pool.query("SELECT 1");
  res.json({ status: "ok", database: "connected" });
});

app.use("/api/hotels", hotelRoutes);

app.use("/api", (req, res) => {
  res.status(404).json({ message: "Route not found." });
});

app.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      message: "Image must be smaller than 2 MB.",
      errors: { image: "Image must be smaller than 2 MB." },
    });
  }
  if (err.status === 400) {
    return res.status(400).json({
      message: err.message,
      errors: { image: err.message },
    });
  }
  console.error(err);
  res.status(500).json({ message: "Something went wrong on the server." });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
