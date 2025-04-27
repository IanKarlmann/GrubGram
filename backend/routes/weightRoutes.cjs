const express = require("express");
const { logWeight, getWeightHistory } = require("../controllers/weightController.cjs");

const router = express.Router();

// Route to log weight (overwrite if logged on the same day)
router.post("/log", logWeight);

// Route to fetch weight history
router.get("/", getWeightHistory);

module.exports = router;