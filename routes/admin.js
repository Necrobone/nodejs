const express = require('express');

const Router = express.Router();

const products = [];

Router.get('/add-product', (request, response) => {
    response.render('add-product', {title: 'Add Product', path: '/admin/add-product'});
});

Router.post('/add-product', (request, response) => {
    products.push({title: request.body.title});
    response.redirect('/');
});

module.exports.routes = Router;
module.exports.products = products;
