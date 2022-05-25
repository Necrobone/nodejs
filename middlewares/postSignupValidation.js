const { body } = require('express-validator')
const User = require("../models/user");

const postSignupValidation = () => {
    return [
        body('email', 'Please enter a valid email')
            .isEmail()
            .normalizeEmail(),
        body('password', 'Please enter a password with number, text and 5 characters')
            .isLength({min: 5})
            .isAlphanumeric()
            .trim(),
        body('confirmPassword')
            .custom((value, {req}) => {
                if (value !== req.body.password) {
                    throw new Error('Password confirmation does not match password');
                }
                return true;
            }),
    ];
}

module.exports = {
    postSignupValidation
}
