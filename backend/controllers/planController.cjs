const axios = require('axios');
const User = require('../models/User.cjs');
const jwt = require("jsonwebtoken");

// Extract environment variables for readability
const appId = process.env.EDAMAM_APP_ID;
const appKey = process.env.EDAMAM_APP_KEY;

const getMealPlan = async (req, res) => {
    try {
        
        const userId = '6817f1b19cf7295f1f393d6b'; 

        // Fetch user information from the database
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Populate "health" and "diet" based on user preferences
        const healthPreferences = [];

        // Add allergies to healthPreferences
        if (user.allergies && user.allergies.length > 0) {
            healthPreferences.push(...user.allergies.join(",").split(",").map(allergy => `${allergy.toLowerCase()}-free`));
        }

        // Add dietary preferences to healthPreferences
        if (user.dietaryPreferences) {
            if (user.dietaryPreferences === "vegetarian" || user.dietaryPreferences === "vegan" || user.dietaryPreferences === "paleo") {
                healthPreferences.push(user.dietaryPreferences); // Add as is
            } else if (user.dietaryPreferences === "keto") {
                healthPreferences.push("keto-friendly"); // Add "keto-friendly"
            }
            // If "no preference", do nothing
        }

        // Prepare the request body
        const requestBody = {
            size: 7,
            plan: {
                accept: {
                    all: [
                        {
                            "health": healthPreferences
                        }
                    ]
                },
                fit: {
                    "ENERC_KCAL": {
                        min: 1000,
                        max: 2000
                    },
                    "SUGAR.added": {
                        max: 20
                    }
                },
                "sections":{
                    "breakfast": {
                        "accept": {
                            "all":[
                                {
                                    "dish": ["biscuits and cookies", "bread", "cereals", "drinks", "egg", "pancake", "pastry"]
                                },
                                {
                                    "meal": ["breakfast", "snack"]
                                }
                            ]
                        },
                        "fit": {
                            "ENERC_KCAL": {
                                "min": 100,
                                "max": 600
                            },
                        }
                    },
                    "lunch": {
                        "accept": {
                            "all":[
                                {
                                    "dish": ["main course", "pasta", "pies and tarts", "pizza", "preps", "salad", "sandwiches", "seafood", "side dish", "soup"]
                                },
                                {
                                    "meal": ["lunch/dinner", "teatime", "snack"]
                                }
                            ]
                        },
                        "fit": {
                            "ENERC_KCAL": {
                                "min": 200,
                                "max": 900
                            },
                        }
                    },
                    "dinner": {
                        "accept": {
                            "all":[
                                {
                                    "dish": ["main course"]
                                },
                                {
                                    "meal": ["lunch/dinner"]
                                }
                            ]
                        },
                        "fit": {
                            "ENERC_KCAL": {
                                "min": 300,
                                "max": 1000
                            },
                        }
                    }
                }
            }
        };

        // Assemble the POST request URL and headers
        const planUrl = `https://api.edamam.com/api/meal-planner/v1/${appId}/select?app_id=${appId}&app_key=${appKey}`;
        const headers = {
            'Content-Type': 'application/json',
            'Edamam-Account-User': 'user'
        };

        // Make the POST request to the Edamam API
        const planResponse = await axios.post(planUrl, requestBody, { headers });
        
        // Parse the "assigned" URIs from the response
        const breakfastURIs = planResponse.data.selection.map(item => item.sections.breakfast.assigned);
        const lunchURIs = planResponse.data.selection.map(item => item.sections.lunch.assigned);
        const dinnerURIs = planResponse.data.selection.map(item => item.sections.dinner.assigned);

        
        // Assemble the GET request URL for meal details
        const breakfastUriParams = breakfastURIs.map(uri => `uri=${encodeURIComponent(uri)}`).join('&');
        const breakfastUrl = `https://api.edamam.com/api/recipes/v2/by-uri?${breakfastUriParams}&app_id=${appId}&app_key=${appKey}&field=label&field=image&field=url&field=ingredientLines&field=yield&field=calories`;
        const breakfastHeaders = {
            'Content-Type': 'application/json',
            'Edamam-Account-User': 'user',
            'Accept-Language': 'en'
        };

        const lunchUriParams = lunchURIs.map(uri => `uri=${encodeURIComponent(uri)}`).join('&');
        const lunchUrl = `https://api.edamam.com/api/recipes/v2/by-uri?${lunchUriParams}&app_id=${appId}&app_key=${appKey}&field=label&field=image&field=url&field=ingredientLines&field=yield&field=calories`;
        const lunchHeaders = {
            'Content-Type': 'application/json',
            'Edamam-Account-User': 'user',
            'Accept-Language': 'en'
        };

        const dinnerUriParams = dinnerURIs.map(uri => `uri=${encodeURIComponent(uri)}`).join('&');
        const dinnerUrl = `https://api.edamam.com/api/recipes/v2/by-uri?${dinnerUriParams}&app_id=${appId}&app_key=${appKey}&field=label&field=image&field=url&field=ingredientLines&field=yield&field=calories`;
        const dinnerHeaders = {
            'Content-Type': 'application/json',
            'Edamam-Account-User': 'user',
            'Accept-Language': 'en'
        };
        
        // Make the GET request to fetch meal details
        const breakfastResponse = await axios.get(breakfastUrl, { headers: breakfastHeaders });
        const lunchResponse = await axios.get(lunchUrl, { headers: lunchHeaders });
        const dinnerResponse = await axios.get(dinnerUrl, { headers: dinnerHeaders });

        // ------------------------------ DEBUG LOGGING -----------------------------
        // POST request details
        // console.log("Request URL:", planUrl);
        // console.log("Request Headers:", headers);
        // console.log("user.allergies:", user.allergies);
        // console.log("user.dietaryPreferences:", user.dietaryPreferences);
        // console.log("healthPreferences:", healthPreferences);
        // console.log("Request Body:", JSON.stringify(requestBody, null, 2));
        // POST response data
        // console.log("POST Response Data:", JSON.stringify(planResponse.data, null, 2));
        // console.log("Assigned Breakfast URIs:", breakfastURIs);
        // console.log("Assigned Lunch URIs:", lunchURIs);
        // console.log("Assigned Dinner URIs:", dinnerURIs);
        // GET request details
        // console.log("Meals Request URL:", mealsUrl);
        // console.log("Meals Request Headers:", mealsHeaders);
        // GET response data
        // console.log("GET Breakfast Response Data:", JSON.stringify(breakfastResponse.data, null, 2));
        // console.log("GET Lunch Response Data:", JSON.stringify(lunchResponse.data, null, 2));
        // console.log("GET Dinner Response Data:", JSON.stringify(dinnerResponse.data, null, 2));

        // Send the API response back to the client
        res.status(200).json({
            breakfast: breakfastResponse.data.hits.map(hit => ({
                name: hit.recipe.label,
                image: hit.recipe.image,
                url: hit.recipe.url,
                ingredients: hit.recipe.ingredientLines,
                yield: hit.recipe.yield,
                calories: hit.recipe.calories,
            })),
            lunch: lunchResponse.data.hits.map(hit => ({
                name: hit.recipe.label,
                image: hit.recipe.image,
                url: hit.recipe.url,
                ingredients: hit.recipe.ingredientLines,
                yield: hit.recipe.yield,
                calories: hit.recipe.calories,
            })),
            dinner: dinnerResponse.data.hits.map(hit => ({
                name: hit.recipe.label,
                image: hit.recipe.image,
                url: hit.recipe.url,
                ingredients: hit.recipe.ingredientLines,
                yield: hit.recipe.yield,
                calories: hit.recipe.calories,
            })),
        });
    } catch (error) {
        console.error('Error fetching meal plan:', error.message);
        res.status(500).json({ error: 'Failed to fetch meal plan' });
    }
};

module.exports = { getMealPlan };