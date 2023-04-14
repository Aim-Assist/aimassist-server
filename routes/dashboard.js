const express = require('express');
require('dotenv').config();
const router = express.Router();

const dashboardController = require('../controllers/dashboard');

router.get('/getFrequency/:id', dashboardController.getFrequency)
router.get('/getAccuracy/:id', dashboardController.getAccuracy)

module.exports = router;