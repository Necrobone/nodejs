const path = require('path');
const express = require('express');
const mongoose = require('mongoose');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.urlencoded({
    extended: false,
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use((request, response, next) => {
    User.findById('6261b5893efc20672ee057e7')
        .then(user => {
            request.user = user;
            next();
        })
        .catch(error => console.log(error));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
    .connect('mongodb+srv://root:wUkLd5QqMMX7vQgQ@shop.bcjtd.mongodb.net/shop?retryWrites=true&w=majority')
    .then(result => {
        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: 'Necrobone',
                    email: 'necrobone@hotmail.com',
                    cart: {
                        products: [],
                    }
                })
                user.save();
            }
        })


        app.listen(3000);
    })
    .catch(error => console.log(error));
