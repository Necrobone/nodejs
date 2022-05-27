const express = require('express');
const adminController = require('../controllers/admin');
const isAuth = require('../middlewares/is-auth');
const {postAddProductValidation} = require("../middlewares/postAddProductValidation");
const {postEditProductValidation} = require("../middlewares/postEditProductValidation");

const Router = express.Router();

Router.get('/products', isAuth, adminController.getProducts);
Router.get('/add-product', isAuth, adminController.getAddProduct);
Router.post('/add-product', postAddProductValidation(), isAuth, adminController.postAddProduct);
Router.get('/edit-product/:id', isAuth, adminController.getEditProduct);
Router.post('/edit-product', postEditProductValidation(), isAuth, adminController.postEditProduct);
Router.delete('/product/:id', isAuth, adminController.deleteProduct);

module.exports = Router;
