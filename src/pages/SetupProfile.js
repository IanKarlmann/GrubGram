import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./auth.css";

export default function SetupProfile() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  // Generate height options (4'0" to 8'11")
  const generateHeightOptions = () => {
    let options = [];
    for (let feet = 4; feet <= 8; feet++) {
      for (let inches = 0; inches <= 11; inches++) {
        const heightString = `${feet}'${inches}"`;
        const totalInches = feet * 12 + inches;
        options.push({ label: heightString, value: totalInches });
      }
    }
    return options;
  };

  const heightOptions = generateHeightOptions();

  const [formData, setFormData] = useState({
    age: "",
    height: "66", // Default to 5'6" (stored as inches)
    weight: "",
    weightGoal: "",
    activityLevel: "sedentary",
    goals: "weight loss",
    targetCalories: "",
    dietaryPreferences: "no preference",
    allergies: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post("https://grubgram.onrender.com/api/auth/setup-profile", { userId, ...formData });

      alert("Profile setup complete!");
      navigate("/dashboard"); // Redirect to main dashboard

    } catch (err) {
      setError(err.response?.data?.message || "Profile setup failed. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <img src="/logo.jpg" alt="GrubGram Logo" className="logo" />
      <h2>Complete Your Profile</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required />

        {/* Height Dropdown */}
        <label>Height</label>
        <select name="height" value={formData.height} onChange={handleChange} required>
          {heightOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>

        <label>Weight</label> 
        <input type="number" name="weight" placeholder="Weight (in lbs)" value={formData.weight} onChange={handleChange} required />
        <label>Weight Goal</label>
        <input
          type="number"
          name="weightGoal"
          placeholder="Set your weight goal (in lbs)"
          value={formData.weightGoal}
          onChange={handleChange}
          required
        />
        <label>Activity Level</label>
        <select name="activityLevel" value={formData.activityLevel} onChange={handleChange} required>
          <option value="sedentary">Sedentary</option>
          <option value="lightly active">Lightly Active</option>
          <option value="moderately active">Moderately Active</option>
          <option value="very active">Very Active</option>
        </select>

        <label>Goals</label>
        <select name="goals" value={formData.goals} onChange={handleChange} required>
          <option value="weight loss">Weight Loss</option>
          <option value="muscle gain">Muscle Gain</option>
          <option value="maintenance">Maintenance</option>
        </select>

        <input type="number" name="targetCalories" placeholder="Target Calories Per Day" value={formData.targetCalories} onChange={handleChange} required />

        <label>Dietary Preferences</label>
        <select name="dietaryPreferences" value={formData.dietaryPreferences} onChange={handleChange} required>
          <option value="no preference">No Preference</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
          <option value="keto">Keto</option>
          <option value="paleo">Paleo</option>
        </select>

        <input type="text" name="allergies" placeholder="Allergies (comma separated)" value={formData.allergies} onChange={handleChange} />

        <button type="submit" className="btn">Complete Profile</button>
      </form>
    </div>
  );
}
