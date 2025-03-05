const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("../config/db.js");
const authRoutes = require("../routes/authRoutes.cjs");
const postRoutes = require("../routes/PostRoutes.cjs");

//dotenv.config();
dotenv.config({ path: '../config/.env' });
// I have my .env file inside the /config folder
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

app.use('/api/posts', postRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));