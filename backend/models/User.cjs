const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number, required: false }, // Changed to optional
    height: { type: Number, required: false }, // Changed to optional
    weight: { type: Number, required: false }, // Changed to optional
    weightGoal: { type: Number, required: false }, // User's weight goal
  
    activityLevel: { 
      type: String, 
      enum: ["sedentary", "lightly active", "moderately active", "very active"], 
      required: false // Changed to optional
    },
    goals: { 
      type: String, 
      enum: ["weight loss", "muscle gain", "maintenance"], 
      required: false // Changed to optional
    },
    targetCalories: { type: Number, required: false }, // Changed to optional
    dietaryPreferences: { 
      type: String, 
      enum: ["vegetarian", "vegan", "keto", "paleo", "no preference"], 
      required: false // Changed to optional
    },
    allergies: { type: [String], required: false }, // Example: ["peanuts", "dairy", "gluten"]
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);