const User = require("../models/User.cjs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register User (Step 1)
const registerUser = async (req, res) => {
  try {
    console.log("Received Registration Data:", req.body);

    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All required fields must be filled." });
    }

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      fullName,
      email,
      password: hashedPassword
    });

    await user.save();

    // Generate JWT after registration
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    console.log("Token Generated After Registration:", token);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email }
    });

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

    res.json({ token, user: { id: user._id, fullName: user.fullName, email: user.email } });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Setup User Profile (Step 2)
const setupUserProfile = async (req, res) => {
  try {
    console.log("Received Profile Data:", req.body);

    const { userId, age, height, weight, activityLevel, goals, targetCalories, dietaryPreferences, allergies } = req.body;

    if (!userId) {
      console.error("UserID missing in request body.");
      return res.status(400).json({ message: "UserID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.error("User not found for ID:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    // Update user profile fields
    user.age = age;
    user.height = height;
    user.weight = weight;
    user.activityLevel = activityLevel;
    user.goals = goals;
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
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Extract from authenticated request
    const user = await User.findById(userId).select("-password"); // Exclude password

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from the authenticated request
    const { fullName, age, gender, height, weight, activityLevel, goals, dietaryPreferences } = req.body;

    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update only the fields provided
    user.fullName = fullName || user.fullName;
    user.age = age || user.age;
    user.gender = gender || user.gender;
    user.height = height || user.height;
    user.weight = weight || user.weight;
    user.activityLevel = activityLevel || user.activityLevel;
    user.goals = goals || user.goals;
    user.dietaryPreferences = dietaryPreferences || user.dietaryPreferences;

    await user.save();
    res.json({ message: "Profile updated successfully!", user });

  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ensure it's exported
module.exports = { registerUser, loginUser, setupUserProfile, getUserProfile, updateUserProfile };