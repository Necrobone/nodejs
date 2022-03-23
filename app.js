const path = require('path');
const express = require('express');

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

const adminExports = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(express.urlencoded({
    extended: false,
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminExports.routes);
app.use(shopRoutes);

app.use((request, response) => {
    response.status(404).render('404', {title: 'Page Not Found!', path: '404'});
});

app.listen(3000);
