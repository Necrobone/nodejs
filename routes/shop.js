const path = require('path');
const express = require('express');
const rootDir = require('../utils/path');

const Router = express.Router();

Router.get('/', (request, response) => {
    response.sendFile(path.join(rootDir, 'views', 'shop.html'));
    response.render('shop');
});

module.exports = Router;
