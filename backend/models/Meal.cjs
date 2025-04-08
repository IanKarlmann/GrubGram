const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  foodName: {
    type: String,
    required: true,
  },
  serving_qty: {
    type: Number,
    required: true,
  },
  serving_unit: {
    type: String,
    required: true,
  },
  calories: {
    type: Number,
    required: true,
  },
  protein: {
    type: Number,
    required: true,
  },
  carbs: {
    type: Number,
    required: true,
  },
  fat: {
    type: Number,
    required: true,
  },
});

const mealSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  mealType: {
    type: String,
    required: true,
  },
  consumedAt: {
    type: Date,
    default: Date.now,
  },
  foodItems: {
    type: [foodItemSchema],
    required: true,
    default: [],
  },
});

module.exports = mongoose.model('Meal', mealSchema);