const express = require('express');
require('dotenv').config();
const router = express.Router();
require('dotenv').config();

const userController = require('../controllers/user');
const authentication = require('../middlewares/Auth');

router.post('/signup', userController.register)
router.post('/login', userController.login)
router.post('/home',authentication, userController.home)
router.get('/logout',authentication, userController.logout)

module.exports = router;