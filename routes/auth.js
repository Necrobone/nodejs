const express = require('express');
const authController = require('../controllers/auth');
const {postSignupValidation} = require("../middlewares/postSignupValidation");
const {postLoginValidation} = require("../middlewares/postLoginValidation");

const Router = express.Router();

Router.get('/login', authController.getLogin);
Router.get('/signup', authController.getSignup);
Router.post('/login', postLoginValidation(), authController.postLogin);
Router.post('/signup', postSignupValidation(), authController.postSignup);
Router.post('/logout', authController.postLogout);
Router.get('/reset', authController.getReset);
Router.post('/reset', authController.postReset);
Router.get('/reset/:token', authController.getNewPassword);
Router.post('/new-password', authController.postNewPassword);

module.exports = Router;
