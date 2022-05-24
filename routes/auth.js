const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/auth');

const Router = express.Router();

Router.get('/login', authController.getLogin);
Router.get('/signup', authController.getSignup);
Router.post('/login', authController.postLogin);
Router.post(
    '/signup',
    [
        body('email', 'Please enter a valid email').isEmail(),
        body('password', 'Please enter a password with number, text and 5 characters').isLength({min: 5}).isAlphanumeric(),
        body('confirmPassword').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password confirmation does not match password');
            }

            return true;
        }),
    ],
    authController.postSignup);
Router.post('/logout', authController.postLogout);
Router.get('/reset', authController.getReset);
Router.post('/reset', authController.postReset);
Router.get('/reset/:token', authController.getNewPassword);
Router.post('/new-password', authController.postNewPassword);

module.exports = Router;
