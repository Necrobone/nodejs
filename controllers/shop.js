const Product = require('../models/product');

exports.getIndex = (request, response) => {
    Product.fetchAll(products => {
        response.render('shop/index', {
            products: products,
            title: 'Shop',
            path: '/'
        });
    });
};

exports.getProducts = (request, response) => {
    Product.fetchAll(products => {
        response.render('shop/product-list', {
            products: products,
            title: 'All Products',
            path: '/products'
        });
    });
};

exports.getProduct = (request, response) => {
    const id = request.params.id;

    Product.findById(id, product => {
        response.render('shop/product-detail', {
            product: product,
            title: product.title,
            path: '/products'
        });
    });
};

exports.getCart = (request, response) => {
    response.render('shop/cart', {
        path: '/cart',
        title: 'Your Cart'
    });
};

exports.postCart = (request, response) => {
    const id = request.body.id;
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        title: 'Checkout'
    });
};

exports.getOrders = (request, response) => {
    response.render('shop/orders', {
        path: '/orders',
        title: 'Your Orders'
    });
};
