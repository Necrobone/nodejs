const User = require("../models/user");
const BCrypt = require('bcryptjs');

exports.getLogin = (request, response) => {
    response.render('auth/login', {
        title: 'Login',
        path: '/login',
        formsCSS: true,
        authCSS: true
    });
};

exports.getSignup = (request, response) => {
    response.render('auth/signup', {
        title: 'Signup',
        path: '/signup',
        formsCSS: true,
        authCSS: true
    });
};

exports.postLogin = (request, response) => {
    const email = request.body.email;
    const password = request.body.password;


    User.findOne({email: email})
        .then(user => {
            if (!user) {
                return response.redirect('/login');
            }
            BCrypt.compare(password, user.password)
                .then(match => {
                    if (match) {
                        request.session.isLoggedIn = true;
                        request.session.user = user;
                        return request.session.save(error => {
                            console.log(error);
                            response.redirect('/');
                        });
                    }

                    response.redirect('/login');
                })
                .catch(error => {
                    console.log(error);
                    response.redirect('/login');
                });
        })
        .catch(error => console.log(error));
};

exports.postSignup = (request, response) => {
    const email = request.body.email;
    const password = request.body.password;
    const confirmPassword = request.body.confirmPassword;

    User.findOne({email: email})
        .then(existingUser => {
            if (existingUser) {
                return response.redirect('/signup');
            }

            return BCrypt.hash(password, 12)
                .then(password => {
                    const user = new User({
                        email: email,
                        password: password,
                        cart: {items: []}
                    });

                    return user.save();
                })
                .then(() => {
                    response.redirect('/');
                });
        })
        .catch(error => console.log(error));
};

exports.postLogout = (request, response) => {
    request.session.destroy(result => {
        console.log(result);
        response.redirect('/');
    });
};
