const Weight = require("../models/Weight.cjs");
const User = require("../models/User.cjs");

// Log weight (overwrite if logged on the same day)
exports.logWeight = async (req, res) => {
  try {
    const { userId, weight } = req.body;

    if (!userId || !weight) {
      return res.status(400).json({ error: "User ID and weight are required." });
    }

    // Ensure the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Get the start of the current day
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    // Check if a weight entry already exists for the current day
    const existingEntry = await Weight.findOne({
      userId,
      date: { $gte: startOfDay },
    });

    if (existingEntry) {
      // Update the existing entry
      existingEntry.weight = weight;
      await existingEntry.save();
      return res.status(200).json({ message: "Weight updated successfully.", weightEntry: existingEntry });
    }

    // Create a new weight entry
    const weightEntry = new Weight({
      userId,
      weight,
    });

    await weightEntry.save();
    res.status(201).json({ message: "Weight logged successfully.", weightEntry });
  } catch (error) {
    console.error("Error logging weight:", error);
    res.status(500).json({ error: "Failed to log weight." });
  }
};

// Fetch weight history
exports.getWeightHistory = async (req, res) => {
    try {
      const { userId } = req.query;
  
      if (!userId) {
        return res.status(400).json({ error: "User ID is required." });
      }
  
      // Fetch the user to get the initial weight and registration date
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }
  
      // Fetch weight entries for the user, sorted by date
      const weightHistory = await Weight.find({ userId }).sort({ date: 1 });
  
      // Add the initial weight if no entry exists for the registration date
      if (user.weight) {
        const registrationDate = new Date(user.createdAt);
        registrationDate.setHours(0, 0, 0, 0); // Normalize to start of the day
  
        const hasInitialWeight = weightHistory.some(
          (entry) => new Date(entry.date).getTime() === registrationDate.getTime()
        );
  
        if (!hasInitialWeight) {
          weightHistory.unshift({
            userId: user._id,
            weight: user.weight,
            date: user.createdAt, // Use the user's registration date
          });
        }
      }
  
      res.status(200).json(weightHistory);
    } catch (error) {
      console.error("Error fetching weight history:", error);
      res.status(500).json({ error: "Failed to fetch weight history." });
    }
  };