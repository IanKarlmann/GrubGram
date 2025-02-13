const mongoose = require("mongoose");
require("dotenv").config({ path: "./config.env" });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB Connected Successfully");

    // List available collections (Optional, for debugging)
    const collections = await mongoose.connection.db.collections();
    collections.forEach((collection) =>
      console.log(`Collection: ${collection.collectionName}`)
    );
  } catch (error) {
    console.error("MongoDB Connection Failed:", error);
    process.exit(1);
  }
};

module.exports = connectDB;