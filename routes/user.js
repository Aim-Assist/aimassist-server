const express = require('express');
require('dotenv').config();
const router = express.Router();

const userController = require('../controllers/user');
const authentication = require('../middlewares/Auth');

router.post('/signup', userController.register)
router.post('/login', userController.login)
router.post('/home',authentication, userController.home)
router.post('/logout',authentication, userController.logout)

module.exports = router;