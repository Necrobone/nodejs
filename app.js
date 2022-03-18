const express = require('express');

const app = express();
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(express.urlencoded({
    extended: false,
}));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use((request, response, next) => {
    response.status(404).send('<h1>Page not found</h1>');
});

app.listen(3000);
