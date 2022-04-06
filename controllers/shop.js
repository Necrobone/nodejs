const Product = require('../models/product');

exports.getIndex = (request, response) => {
    Product.fetchAll()
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
    Product.fetchAll()
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

    Product.findById(id)
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
        .getCartProducts()
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
    Product.findById(id)
        .then(product => {
            return request.user.addToCart(product);
        })
        .then(result => {
            console.log(result);
            response.redirect('/cart');
        })
        .catch(error => console.log(error));
};

exports.getOrders = (request, response) => {
    request.user.getOrders({ include: ['products']})
        .then(orders => {
            response.render('shop/orders', {
                path: '/orders',
                title: 'Your Orders',
                orders: orders
            });
        })
        .catch(error => console.log(error));
};

exports.postOrders = (request, response) => {
    let fetchedCart;
    request.user
        .getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            return request.user.createOrder()
                .then(order => {
                    return order.addProducts(products.map(product => {
                        product.orderItem = { quantity: product.cartItem.quantity }
                        return product;
                    }));
                })
                .catch(error => console.log(error));
        })
        .then(() => {
            return fetchedCart.setProducts(null);
        })
        .then(() => {
            response.redirect('/orders');
        })
        .catch(error => console.log(error));
};

exports.postCartDeleteProduct = (request, response) => {
    let id = request.body.id;
    request.user
        .deleteCartProduct(id)
        .then(response.redirect('/cart'))
        .catch(error => console.log(error));
};
