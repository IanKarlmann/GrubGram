import { useState } from "react";
import axios from "axios";
import "./mealplan.css";

export default function MealPlan() {
  const [filters, setFilters] = useState({
    mealType: "",
    calories: "",
    diet: "",
    health: "",
  });
  const [mealPlan, setMealPlan] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMealPlan(null);

    try {
      const response = await axios.post("https://grubgram.onrender.com/api/meal-plan", filters);
      setMealPlan(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch meal plan.");
    }
  };

  return (
    <div className="mealplan-container">
      <h2>Get Your Recommended Meal Plan</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Meal Type</label>
        <select name="mealType" value={filters.mealType} onChange={handleChange} required>
          <option value="">Select Meal Type</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
        </select>

        <label>Calories (Range)</label>
        <input
          type="text"
          name="calories"
          placeholder="e.g., 300-500"
          value={filters.calories}
          onChange={handleChange}
        />

        <label>Diet</label>
        <select name="diet" value={filters.diet} onChange={handleChange}>
          <option value="">Any</option>
          <option value="balanced">Balanced</option>
          <option value="high-protein">High-Protein</option>
          <option value="low-carb">Low-Carb</option>
          <option value="low-fat">Low-Fat</option>
        </select>

        <label>Health</label>
        <select name="health" value={filters.health} onChange={handleChange}>
          <option value="">Any</option>
          <option value="vegan">Vegan</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="gluten-free">Gluten-Free</option>
          <option value="dairy-free">Dairy-Free</option>
        </select>

        <button type="submit">Get Meal Plan</button>
      </form>

      {mealPlan && filters.mealType ? (
        mealPlan[filters.mealType.toLowerCase()] ? (
          <div className="mealplan-results">
            <h3>Recommended {filters.mealType}</h3>
            <div>
              <h4>{mealPlan[filters.mealType.toLowerCase()].label}</h4>
              <img
                src={mealPlan[filters.mealType.toLowerCase()].image}
                alt={filters.mealType}
              />
            </div>
          </div>
        ) : (
          <p>No recipes available for the selected meal type and filter</p>
        )
      ) : null}
    </div>
  );
}
