const express = require('express');
const shopController = require('../controllers/shop');
const isAuth = require('../middlewares/is-auth');

const Router = express.Router();

Router.get('/', shopController.getIndex);
Router.get('/products', shopController.getProducts);
Router.get('/products/:id', shopController.getProduct);
Router.get('/cart', isAuth, shopController.getCart);
Router.post('/cart', isAuth, shopController.postCart);
Router.get('/orders', isAuth, shopController.getOrders);
Router.get('/checkout', isAuth, shopController.getCheckout);
Router.get('/checkout/success', isAuth, shopController.getCheckoutSuccess);
Router.get('/checkout/cancel', isAuth, shopController.getCheckout);
Router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);
Router.get('/orders/:id/invoice', isAuth, shopController.getOrderInvoice);

module.exports = Router;
