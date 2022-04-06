const path = require('path');
const express = require('express');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
const Client = require('./utils/database').getClient;
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.urlencoded({
    extended: false,
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use((request, response, next) => {
    User.findById('624c90ebb8eab35b4f5c70a4')
        .then(user => {
            request.user = user;
            next();
        })
        .catch(error => console.log(error));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Client(() => {
    app.listen(3000);
})
