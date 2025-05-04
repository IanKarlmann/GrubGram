import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./auth.css";

export default function Account() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [formData, setFormData] = useState({
    age: "",
    height: "",
    weight: "",
    activityLevel: "sedentary",
    goals: "weight loss",
    targetCalories: "",
    dietaryPreferences: "no preference",
    allergies: "",
  });

  const [error, setError] = useState("");

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/user/${userId}`);
        const userData = res.data;

        setFormData({
          age: userData.age || "",
          height: userData.height || "",
          weight: userData.weight || "",
          activityLevel: userData.activityLevel || "sedentary",
          goals: userData.goals || "weight loss",
          targetCalories: userData.targetCalories || "",
          dietaryPreferences: userData.dietaryPreferences || "no preference",
          allergies: userData.allergies?.join(", ") || "",
        });
      } catch (err) {
        setError("Failed to fetch user data. Please try again.");
      }
    };

    fetchUserData();
  }, [userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/auth/update-profile`, { userId, ...formData });

      alert("Profile updated successfully!");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Profile update failed. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <img src="/grub_logo.jpg" alt="GrubGram Logo" className="logo" />
      <h2>Account</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        {/* Age (non-editable) */}
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          disabled
        />

        {/* Height (non-editable) */}
        <label>Height</label>
        <select name="height" value={formData.height} disabled>
          <option value="">{formData.height}</option>
        </select>

        {/* Weight */}
        <label>Weight</label>
        <input
          type="number"
          name="weight"
          placeholder="Weight (in lbs)"
          value={formData.weight}
          onChange={handleChange}
          required
        />

        {/* Activity Level */}
        <label>Activity Level</label>
        <select
          name="activityLevel"
          value={formData.activityLevel}
          onChange={handleChange}
          required
        >
          <option value="sedentary">Sedentary</option>
          <option value="lightly active">Lightly Active</option>
          <option value="moderately active">Moderately Active</option>
          <option value="very active">Very Active</option>
        </select>

        {/* Goals */}
        <label>Goals</label>
        <select
          name="goals"
          value={formData.goals}
          onChange={handleChange}
          required
        >
          <option value="weight loss">Weight Loss</option>
          <option value="muscle gain">Muscle Gain</option>
          <option value="maintenance">Maintenance</option>
        </select>

        {/* Target Calories */}
        <input
          type="number"
          name="targetCalories"
          placeholder="Target Calories Per Day"
          value={formData.targetCalories}
          onChange={handleChange}
          required
        />

        {/* Dietary Preferences */}
        <label>Dietary Preferences</label>
        <select
          name="dietaryPreferences"
          value={formData.dietaryPreferences}
          onChange={handleChange}
          required
        >
          <option value="no preference">No Preference</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
          <option value="keto">Keto</option>
          <option value="paleo">Paleo</option>
        </select>

        {/* Allergies */}
        <input
          type="text"
          name="allergies"
          placeholder="Allergies (comma separated)"
          value={formData.allergies}
          onChange={handleChange}
        />

        <button type="submit" className="btn">Update Profile</button>
      </form>
    </div>
  );
}
