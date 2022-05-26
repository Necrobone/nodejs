const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

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
const storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, 'assets/images')
    },
    filename: (request, file, callback) => {
        callback(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
    },
});
const fileFilter = (request, file, callback) => {
    const validMimeType = file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg';
    callback(null, validMimeType);
}

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.urlencoded({
    extended: false,
}));

app.use(multer({storage, fileFilter}).single('image'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets/images', express.static(path.join(__dirname, 'assets/images')));

app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store,
}));

app.use(csrfProtection);
app.use(flash());

app.use((request, response, next) => {
    response.locals.isLoggedIn = request.session.isLoggedIn;
    response.locals.csrfToken = request.csrfToken();
    next();
});

app.use((request, response, next) => {
    if (!request.session.user) {
        console.log('no session');
        return next();
    }

    User.findById(request.session.user._id)
        .then(user => {
            if (!user) {
                return next();
            }

            request.user = user;
            next();
        })
        .catch(error => {
            const customError = new Error(error);
            customError.httpStatusCode = 500;

            return next(customError);
        });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);

app.use(errorController.get404);

app.use((error, request, response, next) => {
    console.log(error);
    response.status(500).render('500', {
        title: 'Error!',
        path: '/500',
    });
});

mongoose
    .connect(MONGODB_URI)
    .then(result => {
        app.listen(3000);
    })
    .catch(error => console.log(error));
