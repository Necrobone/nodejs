const express = require('express');
const app = express();

app.use((request, response, next) => {
    console.log('In the middleware!');
    next();
});

app.use((request, response, next) => {
    console.log('In another middleware!');
    response.send('<h1>Hello from Express!</h1>');
});

app.listen(3000);
