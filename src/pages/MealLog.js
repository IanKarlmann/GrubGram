import { useState } from "react";
import axios from "axios";
import "./meallog.css";

const getUserEmail = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      return user?.email || "";
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return ""; // Return an empty string if parsing fails
    }
  };

export default function MealLog() {
    const [formData, setFormData] = useState({
        mealType: "",
        foodItems: [{ foodName: "" }], // Array to store multiple food items
        email: getUserEmail(), // Get email from localStorage
    });

    const [error, setError] = useState("");

    const handleChange = (e, index) => {
        const { name, value } = e.target;

        if (name === "mealType" || name === "email") {
            setFormData({ ...formData, [name]: value });
        } else {
            const updatedFoodItems = [...formData.foodItems];
            updatedFoodItems[index][name] = value;
            setFormData({ ...formData, foodItems: updatedFoodItems });
        }
    };

    const addFoodItem = () => {
        const updatedFoodItems = [...formData.foodItems, { foodName: "" }];
        console.log("Adding Food Item:", updatedFoodItems); // Debugging
        setFormData({
            ...formData,
            foodItems: updatedFoodItems,
        });
    };

    const removeFoodItem = (index) => {
        const updatedFoodItems = formData.foodItems.filter((_, i) => i !== index);
        console.log("Removing Food Item:", updatedFoodItems); // Debugging
        setFormData({ ...formData, foodItems: updatedFoodItems });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form submitted", formData); // Debugging

        try {
            const res = await axios.post("http://localhost:5001/api/nutrition/analyze", formData);

            // Clear the form entry after submission
            setFormData({
                mealType: "",
                foodItems: [{ foodName: "" }],
                email: JSON.parse(localStorage.getItem("user"))?.email || "", // Reset email from localStorage
            });

            console.log("Response Data:", res.data); // Debugging
        } catch (err) {
            console.error("Error Response:", err); // Debugging
            setError("Failed to log meal. Please try again.");
        }
    };

    return (
        <div>
            <div className="meal-log-container">
                <h2>Log Your Meal</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <select
                        name="mealType"
                        value={formData.mealType}
                        onChange={(e) => handleChange(e)}
                        required
                    >
                        <option value="" disabled>
                            Select Meal Type
                        </option>
                        <option value="breakfast">Breakfast</option>
                        <option value="lunch">Lunch</option>
                        <option value="dinner">Dinner</option>
                        <option value="snack">Snack</option>
                    </select>

                    {formData.foodItems.map((item, index) => (
                        <div key={index} className="food-item-input">
                            <input
                                type="text"
                                name="foodName"
                                placeholder={`Food Item ${index + 1}`}
                                value={item.foodName}
                                onChange={(e) => handleChange(e, index)}
                                required
                            />
                            {formData.foodItems.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeFoodItem(index)}
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}

                    <button type="button" onClick={addFoodItem}>
                        + Add Food Item
                    </button>

                    <button type="submit">Log Meal</button>
                </form>
            </div>
        </div>
    );
}