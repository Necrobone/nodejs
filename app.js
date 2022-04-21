const path = require('path');
const express = require('express');
const mongoose = require('mongoose');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
// const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.urlencoded({
    extended: false,
}));

app.use(express.static(path.join(__dirname, 'public')));

// app.use((request, response, next) => {
//     User.findById('624c90ebb8eab35b4f5c70a4')
//         .then(user => {
//             request.user = new User(user.name, user.email, user.cart, user._id);
//             next();
//         })
//         .catch(error => console.log(error));
// });

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
    .connect('mongodb+srv://root:wUkLd5QqMMX7vQgQ@shop.bcjtd.mongodb.net/shop?retryWrites=true&w=majority')
    .then(result => {
        app.listen(3000);
    })
    .catch(error => console.log(error));
