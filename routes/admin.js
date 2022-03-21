const path = require('path');
const express = require('express');
const rootDir = require('../utils/path');

const Router = express.Router();

const products = [];

Router.get('/add-product', (request, response) => {
    response.sendFile(path.join(rootDir, 'views', 'add-product.html'));
});

Router.post('/add-product', (request, response) => {
    products.push({title: request.body.title});
    response.redirect('/');
});

module.exports.routes = Router;
module.exports.products = products;
