const User = require("../models/user");

exports.getLogin = (request, response) => {
    response.render('auth/login', {
        title: 'Login',
        path: '/login',
        formsCSS: true,
        authCSS: true,
        isLoggedIn: request.session.isLoggedIn
    });
};

exports.postLogin = (request, response) => {
    User.findById('6261b5893efc20672ee057e7')
        .then(user => {
            request.session.isLoggedIn = true;
            request.session.user = new User(user);
            console.log(user);
            response.redirect('/');
        })
        .catch(error => console.log(error));
};
