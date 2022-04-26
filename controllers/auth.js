exports.getLogin = (request, response) => {
    response.render('auth/login', {
        title: 'Login',
        path: '/login',
        formsCSS: true,
        authCSS: true,
        isLoggedIn: true
    });
};

exports.postLogin = (request, response) => {
    response.redirect('/');
};
