import { useState } from "react";
import axios from "axios";
import "./mealplan.css";

export default function MealPlan() {
  const [mealPlan, setMealPlan] = useState(null);
  const [error, setError] = useState("");
  const [days, setDays] = useState("1"); // Default to 1 day

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMealPlan(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No token found. Please log in again.");
        return;
      }

      const response = await axios.post(
        "https://grubgram.onrender.com/api/meal-plan",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMealPlan(response.data);
      console.log("Meal Plan Data:", response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch meal plan.");
    }
  };

  const handleDaysChange = (e) => {
    setDays(e.target.value);
  };

  return (
    <div className="mealplan-container">
      <h2>Get Your Recommended Meal Plan</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Days of Meal Plans</label>
        <select name="days" value={days} onChange={handleDaysChange} required>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
        </select>

        <button type="submit">Get Meal Plan</button>
      </form>

      {/* Render meal plan boxes */}
      {mealPlan && (
        <div className="mealplan-results">
          {Array.from({ length: days }, (_, dayIndex) => (
            <div key={dayIndex} className="meal-day">
              <h3>Day {dayIndex + 1}</h3>
              <div className="meal-box">
                <h4>Breakfast #{dayIndex + 1}</h4>
                <p>{mealPlan.breakfast?.[dayIndex]?.name || "No meal available"}</p>
                {mealPlan.breakfast?.[dayIndex]?.image && (
                  <img
                    src={mealPlan.breakfast[dayIndex].image}
                    alt={`Breakfast ${dayIndex + 1}`}
                    className="meal-image"
                  />
                )}
                {mealPlan.breakfast?.[dayIndex]?.url && (
                  <a
                    href={mealPlan.breakfast[dayIndex].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="meal-link"
                  >
                    View Recipe
                  </a>
                )}
              </div>
              <div className="meal-box">
                <h4>Lunch #{dayIndex + 1}</h4>
                <p>{mealPlan.lunch?.[dayIndex]?.name || "No meal available"}</p>
                {mealPlan.lunch?.[dayIndex]?.image && (
                  <img
                    src={mealPlan.lunch[dayIndex].image}
                    alt={`Lunch ${dayIndex + 1}`}
                    className="meal-image"
                  />
                )}
                {mealPlan.lunch?.[dayIndex]?.url && (
                  <a
                    href={mealPlan.lunch[dayIndex].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="meal-link"
                  >
                    View Recipe
                  </a>
                )}
              </div>
              <div className="meal-box">
                <h4>Dinner #{dayIndex + 1}</h4>
                <p>{mealPlan.dinner?.[dayIndex]?.name || "No meal available"}</p>
                {mealPlan.dinner?.[dayIndex]?.image && (
                  <img
                    src={mealPlan.dinner[dayIndex].image}
                    alt={`Dinner ${dayIndex + 1}`}
                    className="meal-image"
                  />
                )}
                {mealPlan.dinner?.[dayIndex]?.url && (
                  <a
                    href={mealPlan.dinner[dayIndex].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="meal-link"
                  >
                    View Recipe
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}