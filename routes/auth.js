const express = require('express');
const authController = require('../controllers/auth');

const Router = express.Router();

Router.get('/login', authController.getLogin);
Router.post('/login', authController.postLogin);
Router.post('/logout', authController.postLogout);

module.exports = Router;
