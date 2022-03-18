const express = require('express');
const app = express();

app.use('/users', (request, response, next) => {
    console.log('/users middleware');
    request.send('<p>The Middleware that handles just /users</p>');
});

app.use('/', (request, response, next) => {
    console.log('/ middleware');
    request.send('<p>The Middleware that handles just /</p>');
});

app.listen(3000);
