const express = require('express');
require('dotenv').config();
const router = express.Router();
require('dotenv').config();

const roundController = require('../controllers/rounds')

router.post('/postRound', roundController.postRoundData)

module.exports = router;
