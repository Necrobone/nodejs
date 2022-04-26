const express = require('express');
const authController = require('../controllers/auth');

const Router = express.Router();

Router.get('/login', authController.getLogin);

module.exports = Router;
