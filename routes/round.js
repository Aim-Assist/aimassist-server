const express = require('express');
require('dotenv').config();
const router = express.Router();
require('dotenv').config();

const roundController = require('../controllers/rounds');
const authentication = require('../middlewares/Auth');

router.post('/postRound', roundController.postRoundData)
router.get('/getAllRound', roundController.getAllRoundData)
// router.get('/getAllRound',authentication, roundController.getAllRoundData)
// router.get('/allScores', roundController.getAllScores)

module.exports = router;