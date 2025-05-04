const Meal = require("../models/Meal.cjs");

const getMealsForToday = async (req, res) => {
    try {
        console.log("=== getMealsForToday called ===");
        
        // Log the authenticated user
        console.log("Authenticated user:", req.user);
        
        if (!req.user || !req.user.id) {
            console.log("No user ID found in request");
            return res.status(401).json({ message: "User not authenticated properly" });
        }
        
        const userId = req.user.id;
        console.log("Looking for meals for user ID:", userId);
        
        // Create date objects for start and end of today
        const today = new Date();
        console.log("Current server time:", today);
        
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
        
        console.log("Date range:", {
            startOfDay: startOfDay.toISOString(),
            endOfDay: endOfDay.toISOString()
        });
        
        // Now search using the correct field name "consumedAt" instead of "date"
        console.log("Executing query for today's meals using consumedAt field...");
        const meals = await Meal.find({
            userId: userId,
            consumedAt: { $gte: startOfDay, $lte: endOfDay }
        }).sort({ consumedAt: 1 });
        
        console.log(`Found ${meals.length} meals for today`);
        
        res.status(200).json(meals);
    } catch (error) {
        console.error("Error fetching meals for today:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { getMealsForToday };