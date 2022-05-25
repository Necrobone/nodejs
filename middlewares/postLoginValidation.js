const { body } = require('express-validator')

const postLoginValidation = () => {
    return [
        body('email', 'Please enter a valid email')
            .isEmail()
            .normalizeEmail(),
        body('password', 'Please enter a password with number, text and 5 characters')
            .isLength({min: 5})
            .isAlphanumeric()
            .trim(),
    ];
}

module.exports = {
    postLoginValidation
}
