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
    request.session.isLoggedIn = true;
    response.redirect('/');
};
