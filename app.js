const path = require('path');
const express = require('express');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');

const Database = require('./utils/database');
const Product = require('./models/product');
const User = require('./models/user');

Product.belongsTo(User, {
    constraints: true,
    onDelete: 'CASCADE'
});
User.hasMany(Product);

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.urlencoded({
    extended: false,
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use((request, response, next) => {
    User.findByPk(1)
        .then(user => {
            request.user = user;
            next();
        })
        .catch(error => console.log(error));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Database.sync()
    .then(result => {
        return User.findByPk(1);
    })
    .then(user =>{
        if (!user) {
            return User.create({name: 'Juan', email: 'necrobone@hotmail.com'});
        }

        return user;
    })
    .then(() => {
        app.listen(3000);
    })
    .catch(error => console.log(error));
