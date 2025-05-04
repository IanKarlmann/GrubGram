const mongoose = require("mongoose");

const weightSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now, // Automatically set the date to the current time
    unique: true, // Ensure only one entry per date
  },
});

module.exports = mongoose.model("Weight", weightSchema);