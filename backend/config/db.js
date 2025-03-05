const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from the .env file
dotenv.config();

const connectDB = async () => {
  try {
    // Check if MONGODB_URI is loaded correctly
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in the .env file');
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;