const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI = 'mongodb+srv://root:wUkLd5QqMMX7vQgQ@shop.bcjtd.mongodb.net/shop';

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions',
});
const csrfProtection = csrf({});

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.urlencoded({
    extended: false,
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store,
}));

app.use(csrfProtection);
app.use(flash());

app.use((request, response, next) => {
    if (!request.session.user) {
        console.log('no session');
        return next();
    }

    User.findById(request.session.user._id)
        .then(user => {
            request.user = user;
            next();
        })
        .catch(error => console.log(error));
});

app.use((request, response, next) => {
    response.locals.isLoggedIn = request.session.isLoggedIn;
    response.locals.csrfToken = request.csrfToken();
    next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
    .connect(MONGODB_URI)
    .then(result => {
        app.listen(3000);
    })
    .catch(error => console.log(error));
