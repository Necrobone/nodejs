const express = require('express');

const app = express();

app.use(express.urlencoded({
    extended: false,
}));

app.get('/add-product', (request, response) => {
    console.log('/add-product middleware');
    response.send(
        '<form action="/product" method="post">' +
            '<input type="text" name="title" />' +
            '<button type="submit">Add Product</button>' +
        '</form>'
    );
});

app.post('/product', (request, response) => {
    console.log(request.body);
    response.redirect('/');
});

app.get('/', (request, response) => {
    console.log('/ middleware');
    response.send('<p>The Middleware that handles just /</p>');
});

app.listen(3000);
