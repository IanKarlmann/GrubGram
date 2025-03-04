import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import "./account.css"; 

export default function Account() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    activityLevel: "",
    goals: "",
    dietaryPreferences: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch user profile on page load
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found.");
          return;
        }

        const res = await axios.get("http://localhost:5001/api/auth/user-profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFormData(res.data); // Populate form with user data
      } catch (err) {
        console.error("Error fetching profile:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        "http://localhost:5001/api/auth/update-profile",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Update failed.");
    }
  };

  return (
    <>
      <Header />
      <div className="account-container">
        <h2>Account Details</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>Full Name</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} />

            <label>Email (cannot be changed)</label>
            <input type="email" name="email" value={formData.email} disabled />

            <label>Age</label>
            <input type="number" name="age" value={formData.age} onChange={handleChange} />

            <label>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            <label>Height (in inches)</label>
            <input type="number" name="height" value={formData.height} onChange={handleChange} />

            <label>Weight (in lbs)</label>
            <input type="number" name="weight" value={formData.weight} onChange={handleChange} />

            <label>Activity Level</label>
            <select name="activityLevel" value={formData.activityLevel} onChange={handleChange}>
              <option value="sedentary">Sedentary</option>
              <option value="lightly active">Lightly Active</option>
              <option value="moderately active">Moderately Active</option>
              <option value="very active">Very Active</option>
            </select>

            <label>Goals</label>
            <select name="goals" value={formData.goals} onChange={handleChange}>
              <option value="weight loss">Weight Loss</option>
              <option value="muscle gain">Muscle Gain</option>
              <option value="maintenance">Maintenance</option>
            </select>

            <label>Dietary Preferences</label>
            <select name="dietaryPreferences" value={formData.dietaryPreferences} onChange={handleChange}>
              <option value="no preference">No Preference</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="keto">Keto</option>
              <option value="paleo">Paleo</option>
            </select>

            <button type="submit">Save Changes</button>
          </form>
        )}
        {message && <p className="message">{message}</p>}
      </div>
    </>
  );
}