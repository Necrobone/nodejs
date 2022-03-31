const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getIndex = (request, response) => {
    Product.findAll()
        .then(products => {
            response.render('shop/index', {
                products: products,
                title: 'Shop',
                path: '/'
            });
        })
        .catch(error => console.log(error));
};

exports.getProducts = (request, response) => {
    Product.findAll()
        .then(products => {
            response.render('shop/product-list', {
                products: products,
                title: 'All Products',
                path: '/products'
            });
        })
        .catch(error => console.log(error));
};

exports.getProduct = (request, response) => {
    const id = request.params.id;

    Product.findByPk(id)
        .then(product => {
            response.render('shop/product-detail', {
                product: product,
                title: product.title,
                path: '/products'
            });
        })
        .catch(error => console.log(error));
};

exports.getCart = (request, response) => {
    request.user
        .getCart()
        .then(cart => {
            return cart.getProducts();
        })
        .then(products => {
            response.render('shop/cart', {
                path: '/cart',
                title: 'Your Cart',
                products: products,
                cartCSS: true,
            });
        })
        .catch(error => console.log(error));
};

exports.postCart = (request, response) => {
    const id = request.body.id;
    let fetchedCart;
    let newQuantity = 1;
    request.user
        .getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({where: {id: id}})
        })
        .then(products => {
            let product;
            if (products.length > 0) {
                product = products[0];
            }
            if (product) {
                const oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity + 1;
                return product;
            }

            return Product.findByPk(id);
        })
        .then(product => {
            return fetchedCart.addProduct(product, {
                through: {
                    quantity: newQuantity,
                }
            });
        })
        .then(() => {
            response.redirect('/cart');
        })
        .catch(error => console.log(error));
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
    let id = request.body.id;
    request.user
        .getCart()
        .then(cart => {
            return cart.getProducts({where: {id: id}});
        })
        .then(products => {
            const product = products[0];
            return product.cartItem.destroy();
        })
        .then(result => {
            response.redirect('/cart');
        })
        .catch(error => console.log(error));
};
