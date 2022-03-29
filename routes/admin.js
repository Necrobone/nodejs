const express = require('express');
const adminController = require('../controllers/admin');

const Router = express.Router();

Router.get('/products', adminController.getProducts);
Router.get('/add-product', adminController.getAddProduct);
Router.post('/add-product', adminController.postAddProduct);
Router.get('/edit-product/:id', adminController.getEditProduct);

module.exports = Router;
