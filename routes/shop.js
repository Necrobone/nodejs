const express = require('express');
const shopController = require('../controllers/shop');

const Router = express.Router();

Router.get('/', shopController.getIndex);
Router.get('/products', shopController.getProducts);
Router.get('/cart', shopController.getCart);
Router.get('/checkout', shopController.getCheckout);
Router.get('/orders', shopController.getOrders);

module.exports = Router;
