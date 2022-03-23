const Product = require('../models/product');

exports.getProducts = (request, response) => {
    Product.fetchAll(products => {
        response.render('shop/product-list', {
            products: products,
            title: 'All Products',
            path: '/products'
        });
    });
};

exports.getIndex = (request, response) => {
    Product.fetchAll(products => {
        response.render('shop/index', {
            products: products,
            title: 'Shop',
            path: '/'
        });
    });
};

exports.getCart = (request, response) => {
    response.render('shop/cart', {
        path: '/cart',
        title: 'Your Cart'
    });
};

exports.getOrders = (request, response) => {
    response.render('shop/orders', {
        path: '/orders',
        title: 'Your Orders'
    });
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        title: 'Checkout'
    });
};
