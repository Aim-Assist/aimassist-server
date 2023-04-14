const express = require('express');
require('dotenv').config();
const router = express.Router();

const sessionController = require('../controllers/session');

// Not Required It's Just Used For Creating Devices
router.post('/create', sessionController.createSession)

// For Different Sessions
router.post('/startsession', sessionController.startsession)
router.post('/endsession', sessionController.endsession)
router.get('/getsession', sessionController.getsession)


module.exports = router;