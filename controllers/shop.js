const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getIndex = (request, response) => {
    Product.fetchAll().then(([rows]) => {
        response.render('shop/index', {
            products: rows,
            title: 'Shop',
            path: '/'
        });
    }).catch((error) => {
        console.log(error);
    });
};

exports.getProducts = (request, response) => {
    Product.fetchAll().then(([rows]) => {
        response.render('shop/product-list', {
            products: rows,
            title: 'All Products',
            path: '/products'
        });
    }).catch((error) => {
        console.log(error);
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
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for (product of products) {
                const cartProduct = cart.products.find(cartProduct => cartProduct.id === product.id);
                if (cartProduct) {
                    cartProducts.push({product: product, quantity: cartProduct.quantity});
                }
            }

            response.render('shop/cart', {
                path: '/cart',
                title: 'Your Cart',
                products: cartProducts,
            });
        });
    });
};

exports.postCart = (request, response) => {
    const id = request.body.id;
    Product.findById(id, (product) => {
        Cart.addProduct(id, product.price);
    });
    response.redirect('/cart');
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

exports.postCartDeleteProduct = (request, response) => {
    const id = request.body.id;
    Product.findById(id, product => {
       Cart.deleteProduct(id, product.price);
       response.redirect('/cart');
    });
};
