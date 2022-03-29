const express = require('express');
const shopController = require('../controllers/shop');

const Router = express.Router();

Router.get('/', shopController.getIndex);
Router.get('/products', shopController.getProducts);
Router.get('/products/:id', shopController.getProduct);
Router.get('/cart', shopController.getCart);
Router.post('/cart', shopController.postCart);
Router.get('/checkout', shopController.getCheckout);
Router.get('/orders', shopController.getOrders);
Router.post('/cart-delete-item', shopController.postCartDeleteProduct);

module.exports = Router;
