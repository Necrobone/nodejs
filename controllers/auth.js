const crypto = require('crypto');

const User = require("../models/user");
const BCrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "e0b6a32bb87973",
        pass: "78be982c7914c4"
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

exports.getReset = (request, response) => {
    let error = request.flash('error');
    if (error.length > 0) {
        error = error[0];
    } else {
        error = null;
    }

    response.render('auth/reset', {
        title: 'Reset',
        path: '/reset',
        formsCSS: true,
        authCSS: true,
        error: error
    });
};

exports.postReset = (request, response) => {
    crypto.randomBytes(32, (error, buffer) => {
        if (error) {
            console.log(error);
            return response.redirect('/reset');
        }

        const token = buffer.toString('hex');
        User.findOne({email: request.body.email})
            .then(user => {
                if (!user) {
                    request.flash('error', 'No account with that email found');
                    return response.redirect('/reset');
                }

                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save();
            })
            .then(result => {
                response.redirect('/');
                return transport.sendMail({
                    to: request.body.email,
                    from: 'necrobone@hotmail.com',
                    subject: 'Password reset!',
                    html: `
                        <p>You requested a password reset</p>
                        <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
                    `
                });
            })
            .catch(error => console.log(error));
    })
};

exports.getNewPassword = (request, response) => {
    const token = request.params.token;
    User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
        .then(user => {
            let error = request.flash('error');
            if (error.length > 0) {
                error = error[0];
            } else {
                error = null;
            }

            response.render('auth/new-password', {
                title: 'New Password',
                path: '/new-password',
                formsCSS: true,
                authCSS: true,
                error: error,
                userId: user._id.toString()
            });
        })
        .catch(error => console.log(error));
};
