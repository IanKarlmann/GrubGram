const mongoose = require('mongoose');

const mealPlanSchema = new mongoose.Schema({
  breakfast: {
    label: String,
    ingredients: [String],
    calories: Number,
    image: String,
    url: String,
  },
  lunch: {
    label: String,
    ingredients: [String],
    calories: Number,
    image: String,
    url: String,
  },
  dinner: {
    label: String,
    ingredients: [String],
    calories: Number,
    image: String,
    url: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('MealPlan', mealPlanSchema);