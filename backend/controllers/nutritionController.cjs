const axios = require('axios');
const mongoose = require('mongoose');
const User = require('../models/User.cjs'); 
const Meal = require('../models/Meal.cjs'); 

exports.getNutritionInfo = async (req, res) => {
  console.log("Request received:", req.body);
  const { foodItems, email, mealType } = req.body;

  if (!foodItems || !Array.isArray(foodItems) || foodItems.length === 0) {
    return res.status(400).json({ error: 'Food items are required and must be an array' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingMeal = await Meal.findOne({
      userId: user._id,
      mealType,
      consumedAt: { $gte: today }
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
        consumedAt: new Date()
      });

      await meal.save();
      return res.status(200).json({ success: true, meal });
    }
  } catch (err) {
    console.error("Nutritionix API Error:", err.message);
    res.status(500).json({ error: 'Failed to fetch nutrition info' });
  }
};