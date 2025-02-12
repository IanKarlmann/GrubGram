const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Replace the connection string with your MongoDB Atlas connection string
const mongoURI = 'mongodb+srv://grub:grubgrampass@grubgramuserinfo.4rlkr.mongodb.net/?retryWrites=true&w=majority&appName=GrubGramUserInfo';

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch(err => {
    console.error('Database connection error:', err);
});

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model('users', UserSchema);
User.createIndexes();

app.get("/", (req, res) => {
    res.send("App is Working");
});

app.get("/test-connection", async (req, res) => {
    try {
        const user = new User({ name: "Test User", email: "test@example.com" });
        await user.save();
        res.send("Test user saved successfully");
    } catch (e) {
        console.error("Error during test connection:", e);
        res.status(500).send("Test connection failed");
    }
});

app.post("/register", async (req, res) => {
    try {
        console.log("Received request:", req.body);
        const user = new User(req.body);
        let result = await user.save();
        result = result.toObject();
        if (result) {
            delete result.password;
            res.send(req.body);
            console.log(result);
        } else {
            console.log("User already registered");
        }
    } catch (e) {
        console.error("Error during registration:", e);
        res.status(500).send("Something Went Wrong");
    }
});

app.listen(5000, () => {
    console.log("App listening at port 5000");
});