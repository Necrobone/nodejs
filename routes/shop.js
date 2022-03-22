const express = require('express');
const adminExports = require('./admin');

const Router = express.Router();

Router.get('/', (request, response) => {
    const products = adminExports.products;
    response.render('shop', {products, title: 'Shop', path: '/', hasProducts: products.length > 0, activeShop: true, productCSS: true});
});

module.exports = Router;
