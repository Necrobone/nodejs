const User = require("../models/user");
const BCrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "83f4a9b0ce39d0",
        pass: "7c7c5a0a6d74d7"
    }
});

exports.getLogin = (request, response) => {
    let error = request.flash('error');
    if (error.length > 0) {
       error = error[0];
    } else {
        error = null;
    }

    response.render('auth/login', {
        title: 'Login',
        path: '/login',
        formsCSS: true,
        authCSS: true,
        error: error
    });
};

exports.getSignup = (request, response) => {
    let error = request.flash('error');
    if (error.length > 0) {
        error = error[0];
    } else {
        error = null;
    }

    response.render('auth/signup', {
        title: 'Signup',
        path: '/signup',
        formsCSS: true,
        authCSS: true,
        error: error
    });
};

exports.postLogin = (request, response) => {
    const email = request.body.email;
    const password = request.body.password;

    User.findOne({email: email})
        .then(user => {
            if (!user) {
                request.flash('error', 'Invalid email or password.');
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
                request.flash('error', 'E-mail exists already, please use a different one.');
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
                    return transport.sendMail({
                        to: email,
                        from: 'necrobone@hotmail.com',
                        subject: 'Signup Succeeded!',
                        html: '<h1>You successfully signed up!</h1>'
                    });
                })
                .catch(error => console.log(error));
        })
        .catch(error => console.log(error));
};

exports.postLogout = (request, response) => {
    request.session.destroy(result => {
        console.log(result);
        response.redirect('/');
    });
};
