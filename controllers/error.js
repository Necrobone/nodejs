exports.get404 = (request, response) => {
    response.status(404).render('404', {title: 'Page Not Found!', path: '404'});
};
