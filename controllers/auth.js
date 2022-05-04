const User = require("../models/user");

exports.getLogin = (request, response) => {
    response.render('auth/login', {
        title: 'Login',
        path: '/login',
        formsCSS: true,
        authCSS: true,
        isLoggedIn: false
    });
};

exports.getSignup = (request, response) => {
    response.render('auth/signup', {
        title: 'Signup',
        path: '/signup',
        formsCSS: true,
        authCSS: true,
        isLoggedIn: false
    });
};

exports.postLogin = (request, response) => {
    User.findById('6261b5893efc20672ee057e7')
        .then(user => {
            request.session.isLoggedIn = true;
            request.session.user = user;
            request.session.save(error => {
                console.log(error);
                response.redirect('/');
            })
        })
        .catch(error => console.log(error));
};

exports.postSignup = (request, response) => {
};

exports.postLogout = (request, response) => {
    request.session.destroy(result => {
        console.log(result);
        response.redirect('/');
    });
};
