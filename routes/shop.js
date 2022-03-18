const express = require('express');

const Router = express.Router();

Router.get('/', (request, response) => {
    console.log('/ middleware');
    response.send('<p>The Middleware that handles just /</p>');
});

module.exports = Router;
