const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./connect.cjs");
const authRoutes = require("./routes/authRoutes.cjs");

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use((req, res, next) => {
    console.log(`Incoming Request: ${req.method} ${req.url}`);
    console.log(`Request Body:`, req.body);
    next();
});


// Routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));