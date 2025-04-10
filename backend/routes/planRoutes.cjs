const express = require('express');
const { getMealPlan } = require('../controllers/planController.cjs');

const router = express.Router();

// Route to get a meal plan
router.get('/meal-plan', getMealPlan);

module.exports = router;