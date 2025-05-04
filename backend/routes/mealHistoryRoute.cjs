const express = require("express");
const { getMealsForToday } = require("../controllers/mealHistoryController.cjs");
const { protect } = require("../middleware/middleAuth.cjs"); // Middleware to verify JWT

const router = express.Router();

router.get("/today", protect, getMealsForToday);

module.exports = router;