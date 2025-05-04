const express = require('express');
const { getNutritionInfo, getMacroData } = require('../controllers/nutritionController.cjs');

const router = express.Router();

router.post('/analyze', getNutritionInfo);
router.get('/macros', getMacroData);

module.exports = router;