const express = require('express');
const { getNutritionInfo } = require('../controllers/nutritionController.cjs');

const router = express.Router();

router.post('/analyze', getNutritionInfo);

module.exports = router;