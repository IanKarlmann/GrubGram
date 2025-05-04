import React, { useState, useEffect } from "react";
import axios from "axios";
import "./mealHistory.css";

const API_BASE_URL = "http://localhost:5001/api/mealhistory";

export default function MealHistory() {
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMealsForToday();
    }, []);

    const fetchMealsForToday = async () => {
        try {
            setLoading(true);
            console.log("Fetching meals from:", `${API_BASE_URL}/today`);
            
            const token = localStorage.getItem("token");
            console.log("Using token:", token ? "Token exists" : "No token found");
            
            const response = await axios.get(`${API_BASE_URL}/today`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            console.log("Meals data received:", response.data);
            setMeals(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching meals for today:", error.response || error);
            setError(error.response?.data?.message || error.message || "Failed to fetch meals");
            setLoading(false);
        }
    };

    // Calculate total calories for the day
    const totalCalories = meals.reduce((total, meal) => {
        // Sum calories from all food items in each meal
        const mealCalories = meal.foodItems.reduce((mealTotal, item) => {
            return mealTotal + (item.calories || 0);
        }, 0);
        return total + mealCalories;
    }, 0);

    // Helper function to format time
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <>
            <div className="meal-history-container">
                <h2>Today's Meals</h2>
                
                {loading ? (
                    <p>Loading meals...</p>
                ) : error ? (
                    <div className="error-message">
                        <p>Error: {error}</p>
                        <button onClick={fetchMealsForToday} className="retry-button">
                            Retry
                        </button>
                    </div>
                ) : meals.length > 0 ? (
                    <>
                        <div className="total-calories">
                            <p><strong>Total Calories Today:</strong> {totalCalories.toFixed(1)}</p>
                        </div>
                        <ul className="meal-list">
                            {meals.map((meal) => (
                                <li key={meal._id} className="meal-item">
                                    <div className="meal-header">
                                        <h3>{meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1)}</h3>
                                        <span className="meal-time">{formatTime(meal.consumedAt)}</span>
                                    </div>
                                    
                                    <div className="food-items">
                                        <h4>Food Items:</h4>
                                        <ul>
                                            {meal.foodItems.map((item, index) => (
                                                <li key={item._id || index} className="food-item">
                                                    <span className="food-name">{item.foodName}</span>
                                                    <span className="food-serving">{item.serving_qty} {item.serving_unit}</span>
                                                    <span className="food-calories">{item.calories.toFixed(1)} cal</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    
                                    <div className="meal-macros">
                                        <p>
                                            <strong>Total:</strong> {meal.foodItems.reduce((sum, item) => sum + (item.calories || 0), 0).toFixed(1)} calories |
                                            Protein: {meal.foodItems.reduce((sum, item) => sum + (item.protein || 0), 0).toFixed(1)}g |
                                            Carbs: {meal.foodItems.reduce((sum, item) => sum + (item.carbs || 0), 0).toFixed(1)}g |
                                            Fat: {meal.foodItems.reduce((sum, item) => sum + (item.fat || 0), 0).toFixed(1)}g
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </>
                ) : (
                    <p>No meals logged for today.</p>
                )}
            </div>
        </>
    );
}