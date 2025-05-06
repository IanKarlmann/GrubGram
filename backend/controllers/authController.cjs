const User = require("../models/User.cjs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register User (Step 1)
const registerUser = async (req, res) => {
  try {
    console.log("Received Registration Data:", req.body);

    const { fullName, email, password } = req.body;

    // Validate required fields
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All required fields must be filled." });
    }

    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    user = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully", userId: user._id });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt:", email, password);

    // Find user by email
    const user = await User.findOne({ email });
    console.log("User found:", user);

    if (!user) {
      console.log("Error: User not found");
      return res.status(400).json({ message: "Invalid credentials - user not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      console.log("Error: Incorrect password");
      return res.status(400).json({ message: "Invalid credentials - incorrect password" });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    console.log("Generated Token:", token);

    res.json({ token, user: { id: user._id, fullName: user.fullName, email: user.email, allergies: user.allergies, dietaryPreferences: user.dietaryPreferences } });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Setup User Profile (Step 2)
const setupUserProfile = async (req, res) => {
  try {
    const { userId, age, height, weight, weightGoal, activityLevel, goals, targetCalories, dietaryPreferences, allergies } = req.body;

    // Validate weight
    if (weight && (weight < 50 || weight > 700)) {
      return res.status(400).json({ message: "Weight must be between 50 lbs and 700 lbs." });
    }

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update user profile fields
    user.age = age;
    user.height = height;
    user.weight = weight; // Save weight during profile setup
    user.activityLevel = activityLevel;
    user.goals = goals;
    user.weightGoal = weightGoal; 
    user.targetCalories = targetCalories;
    user.dietaryPreferences = dietaryPreferences;
    user.allergies = allergies;

    await user.save();
    res.status(200).json({ message: "Profile updated successfully!" });
  } catch (error) {
    console.error("Profile Setup Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get User by ID
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update User Profile
const updateUserProfile = async (req, res) => {
  try {
    const { userId, weight, activityLevel, goals, targetCalories, dietaryPreferences, allergies } = req.body;

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update only the editable fields
    if (weight) {
      if (weight < 50 || weight > 700) {
        return res.status(400).json({ message: "Weight must be between 50 lbs and 700 lbs." });
      }
      user.weight = weight;
    }
    user.activityLevel = activityLevel;
    user.goals = goals;
    user.targetCalories = targetCalories;
    user.dietaryPreferences = dietaryPreferences;
    user.allergies = allergies ? allergies.split(",").map((a) => a.trim()) : [];

    await user.save();
    res.status(200).json({ message: "Profile updated successfully!" });
  } catch (error) {
    console.error("Profile Update Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerUser, loginUser, setupUserProfile, getUserById, updateUserProfile };