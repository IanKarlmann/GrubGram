const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("../config/db.js");
const authRoutes = require("../routes/authRoutes.cjs");
const postRoutes = require("../routes/postRoutes.cjs");
const nutritionRoutes = require("../routes/nutritionRoutes.cjs");
const http = require("http"); // Import http to work with socket.io
const socketIo = require("socket.io");
const path = require('path');

//dotenv.config();
dotenv.config({ path: '../config/.env' });
// I have my .env file inside the /config folder
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// app.use((req, res, next) => {
//     console.log(`Incoming Request: ${req.method} ${req.url}`);
//     console.log(`Request Body:`, req.body);
//     next();
// });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/nutrition", nutritionRoutes);

app.use('/api/posts', postRoutes(io));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

io.on('connection', (socket) => {
    console.log('New client connected');
    
    // Handle disconnect event
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = io;