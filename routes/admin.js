const express = require('express');

const Router = express.Router();

Router.get('/add-product', (request, response) => {
    console.log('/add-product middleware');
    response.send(
        '<form action="/admin/product" method="post">' +
            '<input type="text" name="title" />' +
            '<button type="submit">Add Product</button>' +
        '</form>'
    );
});

Router.post('/product', (request, response) => {
    console.log(request.body);
    response.redirect('/');
});

module.exports = Router;
