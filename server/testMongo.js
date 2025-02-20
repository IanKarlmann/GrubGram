const mongoose = require("mongoose");
require("dotenv").config({ path: "./config.env" });

mongoose.connect(process.env.ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ Successfully connected to MongoDB"))
.catch(err => console.error("❌ MongoDB Connection Failed:", err));