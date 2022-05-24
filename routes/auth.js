const express = require('express');
const { check } = require('express-validator/check');

const authController = require('../controllers/auth');

const Router = express.Router();

Router.get('/login', authController.getLogin);
Router.get('/signup', authController.getSignup);
Router.post('/login', authController.postLogin);
Router.post('/signup', check('email').isEmail().withMessage('Please enter a valid email'), authController.postSignup);
Router.post('/logout', authController.postLogout);
Router.get('/reset', authController.getReset);
Router.post('/reset', authController.postReset);
Router.get('/reset/:token', authController.getNewPassword);
Router.post('/new-password', authController.postNewPassword);

module.exports = Router;
