import Header from "../components/Header";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
//import { useFormControl } from '@mui/material/FormControl'; // should use to make the page more user friendly

export default function MealLog(){
    const [formData, setFormData] = useState({
        mealType: "",
        food: "",
    });

    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        console.log("Form Data:", formData);

        try {
            const res = await axios.post("http://localhost:5001/api/nutrition", formData);
            console.log(res.data);
            navigate("/home");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to log meal. Please try again.");
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
                    <input type="text" name="food" placeholder="Food Item" value={formData.food} onChange={handleChange} required />
                    <button type="submit">Log Meal</button>
                </form>
            </div>
        </div>
    );
}