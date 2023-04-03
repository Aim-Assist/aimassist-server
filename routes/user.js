const express = require('express');
require('dotenv').config();
const router = express.Router();
require('dotenv').config();

const userController = require('../controllers/user')

router.post('/signup', userController.register)
router.post('/login', userController.login)

module.exports = router;