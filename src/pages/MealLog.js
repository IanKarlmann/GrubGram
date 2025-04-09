import Header from "../components/Header";
import { useState } from "react";
//import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function MealLog() {
    const [formData, setFormData] = useState({
        mealType: "",
        foodName: "", 
        email: JSON.parse(localStorage.getItem("user"))?.email || "", // Get email from localStorage
    });

    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        console.log(`Field changed: ${e.target.name}, Value: ${e.target.value}`); // Debugging
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form submitted", formData); // Debugging


        try {
            const res = await axios.post("http://localhost:5001/api/nutrition/analyze", formData, {
                foodName: formData.foodName,
                email: formData.email,
                mealType: formData.mealType
            });
            console.log("Response Data:", res.data); // Debugging
            //navigate("/home");
        } catch (err) {
            console.error("Error Response:", err); // Debugging
            setError("Failed to log meal. Please try again.");
        }
    };

    return (
        <div>
            <Header />
            <div className="meal-log-container">
                <h2>Log Your Meal</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <select name="mealType" value={formData.mealType} onChange={handleChange} required>
                        <option value="" disabled>Select Meal Type</option>
                        <option value="breakfast">Breakfast</option>
                        <option value="lunch">Lunch</option>
                        <option value="dinner">Dinner</option>
                        <option value="snack">Snack</option>
                    </select>
                    <input
                        type="text"
                        name="foodName" 
                        placeholder="Food Item"
                        value={formData.foodName}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit">Log Meal</button>
                </form>
            </div>
        </div>
    );
}