const Product = require('../models/product');
const Order = require('../models/order');

exports.getIndex = (request, response) => {
    Product.find()
        .then(products => {
            response.render('shop/index', {
                products: products,
                title: 'Shop',
                path: '/',
                productCSS: true,
                isLoggedIn: request.session.isLoggedIn,
            });
        })
        .catch(error => console.log(error));
};

exports.getProducts = (request, response) => {
    Product.find()
        .then(products => {
            response.render('shop/product-list', {
                products: products,
                title: 'All Products',
                path: '/products',
                productCSS: true,
                isLoggedIn: request.session.isLoggedIn,
            });
        })
        .catch(error => console.log(error));
};

exports.getProduct = (request, response) => {
    const id = request.params.id;

    Product.findById(id)
        .then(product => {
            response.render('shop/product-detail', {
                product: product,
                title: product.title,
                path: '/products',
                isLoggedIn: request.session.isLoggedIn,
            });
        })
        .catch(error => console.log(error));
};

exports.getCart = (request, response) => {
    request.session.user
        .populate('cart.products.id')
        .then(user => {
            const products = user.cart.products;
            response.render('shop/cart', {
                path: '/cart',
                title: 'Your Cart',
                products: products,
                cartCSS: true,
                isLoggedIn: request.session.isLoggedIn,
            });
        })
        .catch(error => console.log(error));
};

exports.postCart = (request, response) => {
    const id = request.body.id;
    Product.findById(id)
        .then(product => {
            return request.session.user.addToCart(product);
        })
        .then(result => {
            response.redirect('/cart');
        })
        .catch(error => console.log(error));
};

exports.getOrders = (request, response) => {
    Order.find({"user.id": request.session.user._id})
        .then(orders => {
            response.render('shop/orders', {
                path: '/orders',
                title: 'Your Orders',
                orders: orders,
                ordersCSS: true,
                isLoggedIn: request.session.isLoggedIn,
            });
        })
        .catch(error => console.log(error));
};

exports.postOrders = (request, response) => {
    request.session.user
        .populate('cart.products.id')
        .then(user => {
            const products = user.cart.products.map(product => {
                return {
                    product: product.id._doc,
                    quantity: product.quantity,
                };
            });
            const order = new Order({
                user: {
                    id: request.session.user,
                    name: request.session.user.name,
                },
                products: products
            });

            return order.save();
        })
        .then(result => {
            return request.session.user.clearCart();
        })
        .then(() => response.redirect('/orders'))
        .catch(error => console.log(error));
};

exports.postCartDeleteProduct = (request, response) => {
    let id = request.body.id;
    request.session.user
        .removeFromCart(id)
        .then(() => response.redirect('/cart'))
        .catch(error => console.log(error));
};
