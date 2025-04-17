const axios = require('axios');

const appId = process.env.EDAMAM_APP_ID;
const appKey = process.env.EDAMAM_APP_KEY;
const userId = process.env.EDAMAM_USER_ID; // Add UserID from environment variables
const baseUrl = 'https://api.edamam.com/api/recipes/v2';

// Fetch recipes from Edamam API with filters
const getRecipes = async (mealType, calories, diet, health) => {
  const url = `${baseUrl}?type=public&q=${mealType}&app_id=${appId}&app_key=${appKey}&mealType=${mealType}&calories=${calories}${diet ? `&diet=${diet}` : ''}${health ? `&health=${health}` : ''}`;
  
  try {
    const response = await axios.get(url, {
      headers: {
        'Edamam-Account-User': userId // Include the UserID in the headers
      }
    });
    return response.data.hits.map(hit => hit.recipe);
  } catch (error) {
    console.error('Error fetching recipes:', error.response?.data || error.message);
    throw error;
  }
};

// Generate a meal plan with filters
const getMealPlan = async (req, res) => {
  try {
    const { mealType, calories, diet, health } = req.body; // Extract filters from request body

    // Fetch recipes for each meal type
    const breakfast = await getRecipes(mealType || 'Breakfast', calories || '300-500', diet, health);
    const lunch = await getRecipes(mealType || 'Lunch', calories || '500-700', diet, health);
    const dinner = await getRecipes(mealType || 'Dinner', calories || '600-800', diet, health);

    // Respond with the generated meal plan
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