const axios = require('axios');
const mongoose = require('mongoose');
const User = require('../models/User.cjs'); 
const Meal = require('../models/Meal.cjs'); 

exports.getNutritionInfo = async (req, res) => {
  console.log("Request received:", req.body);
  const { foodItems, email, mealType, date } = req.body;

  if (!foodItems || !Array.isArray(foodItems) || foodItems.length === 0) {
    return res.status(400).json({ error: 'Food items are required and must be an array' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const existingMeal = await Meal.findOne({
      userId: user._id,
      mealType,
      consumedAt: { $gte: targetDate, $lt: nextDay }
    });

    const foodDetails = [];

    // Process each food item
    for (const item of foodItems) {
      const response = await axios.post(
        'https://trackapi.nutritionix.com/v2/natural/nutrients',
        { query: item.foodName },
        {
          headers: {
            'x-app-id': process.env.NUTRITIONIX_APP_ID,
            'x-app-key': process.env.NUTRITIONIX_API_KEY,
            'Content-Type': 'application/json',
          },
        }
      );

      const food = response.data.foods[0];
      foodDetails.push({
        foodName: food.food_name,
        serving_qty: food.serving_qty,
        serving_unit: food.serving_unit,
        calories: food.nf_calories,
        protein: food.nf_protein,
        carbs: food.nf_total_carbohydrate,
        fat: food.nf_total_fat,
      });
    }

    if (existingMeal) {
      existingMeal.foodItems.push(...foodDetails);
      await existingMeal.save();
      return res.status(200).json({ success: true, meal: existingMeal });
    } else {
      const meal = new Meal({
        userId: user._id,
        foodItems: foodDetails,
        mealType,
        consumedAt: date ? new Date(date) : new Date()
      });

      await meal.save();
      return res.status(200).json({ success: true, meal });
    }
  } catch (err) {
    console.error("Nutritionix API Error:", err.message);
    res.status(500).json({ error: 'Failed to fetch nutrition info' });
  }
};

exports.getMacroData = async (req, res) => {
  try {
    const { email } = req.query;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const meals = await Meal.find({ userId: user._id });

    const macroData = meals.map((meal) => ({
      mealType: meal.mealType,
      date: meal.consumedAt,
      macros: meal.foodItems.reduce(
        (totals, item) => ({
          calories: totals.calories + item.calories,
          protein: totals.protein + item.protein,
          carbs: totals.carbs + item.carbs,
          fat: totals.fat + item.fat,
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      ),
    }));

    res.status(200).json(macroData);
  } catch (err) {
    console.error("Error fetching macro data:", err.message);
    res.status(500).json({ error: 'Failed to fetch macro data' });
  }
};