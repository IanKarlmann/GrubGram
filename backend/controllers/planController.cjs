const axios = require('axios');

const appId = process.env.EDAMAM_APP_ID;
const appKey = process.env.EDAMAM_APP_KEY;
const baseUrl = 'https://api.edamam.com/api/recipes/v2';

// Fetch recipes from Edamam API
const getRecipes = async (mealType, calories) => {
  const url = `${baseUrl}?type=public&q=${mealType}&app_id=${appId}&app_key=${appKey}&mealType=${mealType}&calories=${calories}`;
  const response = await axios.get(url);
  return response.data.hits.map(hit => hit.recipe);
};

// Generate a meal plan
const getMealPlan = async (req, res) => {
  try {
    const breakfast = await getRecipes('Breakfast', '300-500');
    const lunch = await getRecipes('Lunch', '500-700');
    const dinner = await getRecipes('Dinner', '600-800');

    res.json({
      breakfast: breakfast[0],
      lunch: lunch[0],
      dinner: dinner[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating meal plan' });
  }
};

module.exports = { getMealPlan };