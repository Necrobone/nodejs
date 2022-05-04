const express = require('express');
const authController = require('../controllers/auth');

const Router = express.Router();

Router.get('/login', authController.getLogin);
Router.get('/signup', authController.getSignup);
Router.post('/login', authController.postLogin);
Router.post('/signup', authController.postSignup);
Router.post('/logout', authController.postLogout);

module.exports = Router;
