const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController.cjs');

// Submit a report
router.post('/', reportController.createReport);

// Get all reports (admin only)
router.get('/', reportController.getAllReports);

// Update report status (admin only)
router.patch('/:id', reportController.updateReportStatus);

module.exports = router;