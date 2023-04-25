const express = require('express');
require('dotenv').config();
const router = express.Router();

const roundController = require('../controllers/rounds');

router.post('/postRound', roundController.postRoundData)
router.get('/getAllRound', roundController.getAllRoundData)
router.get('/getUserRounds/:id', roundController.getUserRounds)

module.exports = router;