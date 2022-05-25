exports.get404 = (request, response) => {
    response.status(404).render('404', {
        title: 'Page Not Found!',
        path: '/404'
    });
};

exports.get500 = (request, response) => {
    response.status(500).render('500', {
        title: 'Error!',
        path: '/500',
    });
};
