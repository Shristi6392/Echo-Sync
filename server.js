const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const partnerRoutes = require("./routes/partnerRoutes");
const adminRoutes = require("./routes/adminRoutes");

dotenv.config();

const app = express();

// ✅ Correct CORS
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://echo-sync-ej9s6a90w-shristishukla6392-4184s-projects.vercel.app"
  ],
  credentials: true
}));

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.json({ message: "Eco-Sync API running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/partner", partnerRoutes);
app.use("/api/admin", adminRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB()
  .then((result) => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      if (result?.memory) {
        console.log("MongoDB unavailable, using in-memory database");
      }
    });
  })
  .catch((error) => {
    console.error("Database connection failed", error);
    process.exit(1);
  });