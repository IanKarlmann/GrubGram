const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./connect.cjs");
const authRoutes = require("./routes/authRoutes.cjs");

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));