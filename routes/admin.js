const express = require('express');
const adminController = require('../controllers/admin');
const isAuth = require('../middlewares/is-auth');

const Router = express.Router();

Router.get('/products', isAuth, adminController.getProducts);
Router.get('/add-product', isAuth, adminController.getAddProduct);
Router.post('/add-product', isAuth, adminController.postAddProduct);
Router.get('/edit-product/:id', isAuth, adminController.getEditProduct);
Router.post('/edit-product', isAuth, adminController.postEditProduct);
Router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = Router;
