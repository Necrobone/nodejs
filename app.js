const path = require('path');
const express = require('express');
const rootDir = require('./utils/path');

const app = express();

app.set('view engine', 'pug');
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
    response.status(404).render('404', {title: 'Page Not Found!'});
});

app.listen(3000);
