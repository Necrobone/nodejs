const { body } = require('express-validator')

const postLoginValidation = () => {
    return [
        body('email', 'Please enter a valid email')
            .isEmail(),
        body('password', 'Please enter a password with number, text and 5 characters')
            .isLength({min: 5})
            .isAlphanumeric(),
    ];
}

module.exports = {
    postLoginValidation
}
