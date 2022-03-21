const path = require('path');
const express = require('express');
const rootDir = require('../utils/path');

const Router = express.Router();

Router.get('/add-product', (request, response) => {
    response.sendFile(path.join(rootDir, 'views', 'add-product.html'));
});

Router.post('/product', (request, response) => {
    console.log(request.body);
    response.redirect('/');
});

module.exports = Router;
