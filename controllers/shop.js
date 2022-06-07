const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const stripe = require('stripe')('yourStripeId');

const Product = require('../models/product');
const Order = require('../models/order');

const ITEMS_PER_PAGE = 1;

exports.getIndex = (request, response, next) => {
    const page = parseInt(request.query.page || 1);
    let totalItems;

    Product.find()
        .countDocuments()
        .then(quantity => {
            totalItems = quantity;
            return Product.find()
                .skip((page -1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE);
        })
        .then(products => {
            response.render('shop/index', {
                products: products,
                title: 'Shop',
                path: '/',
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
                productCSS: true,
            });
        })
        .catch(error => {
            const customError = new Error(error);
            customError.httpStatusCode = 500;

            return next(customError);
        });
};

exports.getProducts = (request, response, next) => {
    const page = parseInt(request.query.page || 1);
    let totalItems;

    Product.find()
        .countDocuments()
        .then(quantity => {
            totalItems = quantity;
            return Product.find()
                .skip((page -1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE);
        })
        .then(products => {
            response.render('shop/product-list', {
                products: products,
                title: 'All Products',
                path: '/products',
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
                productCSS: true,
            });
        })
        .catch(error => {
            const customError = new Error(error);
            customError.httpStatusCode = 500;

            return next(customError);
        });
};

exports.getProduct = (request, response, next) => {
    const id = request.params.id;

    Product.findById(id)
        .then(product => {
            response.render('shop/product-detail', {
                product: product,
                title: product.title,
                path: '/products'
            });
        })
        .catch(error => {
            const customError = new Error(error);
            customError.httpStatusCode = 500;

            return next(customError);
        });
};

exports.getCart = (request, response, next) => {
    request.user
        .populate('cart.products.id')
        .then(user => {
            const products = user.cart.products;
            response.render('shop/cart', {
                path: '/cart',
                title: 'Your Cart',
                products: products,
                cartCSS: true
            });
        })
        .catch(error => {
            const customError = new Error(error);
            customError.httpStatusCode = 500;

            return next(customError);
        });
};

exports.postCart = (request, response, next) => {
    const id = request.body.id;
    Product.findById(id)
        .then(product => {
            return request.user.addToCart(product);
        })
        .then(result => {
            response.redirect('/cart');
        })
        .catch(error => {
            const customError = new Error(error);
            customError.httpStatusCode = 500;

            return next(customError);
        });
};

exports.getCheckout = (request, response, next) => {
    let products;
    let total = 0;
    request.user
        .populate('cart.products.id')
        .then(user => {
            products = user.cart.products;
            total = 0;
            products.forEach(product => {
                total += product.quantity * product.id.price;
            });

            return stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: products.map(product => {
                    return {
                        name: product.id.title,
                        description: product.id.description,
                        amount: product.id.price * 100,
                        currency: 'usd',
                        quantity: product.quantity,
                    }
                }),
                success_url: request.protocol + '://' + request.get('host') + '/checkout/success',
                cancel_url: request.protocol + '://' + request.get('host') + '/checkout/cancel',
            });
        })
        .then(session => {
            response.render('shop/checkout', {
                path: '/checkout',
                title: 'Checkout',
                products: products,
                total,
                session: session.id,
                cartCSS: true
            });
        })
        .catch(error => {
            const customError = new Error(error);
            customError.httpStatusCode = 500;

            return next(customError);
        });
};

exports.getOrders = (request, response, next) => {
    Order.find({"user.id": request.user._id})
        .then(orders => {
            response.render('shop/orders', {
                path: '/orders',
                title: 'Your Orders',
                orders: orders,
                ordersCSS: true
            });
        })
        .catch(error => {
            const customError = new Error(error);
            customError.httpStatusCode = 500;

            return next(customError);
        });
};

exports.getCheckoutSuccess = (request, response, next) => {
    request.user
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
                    id: request.user,
                    email: request.user.email,
                },
                products: products
            });

            return order.save();
        })
        .then(result => {
            return request.user.clearCart();
        })
        .then(() => response.redirect('/orders'))
        .catch(error => {
            const customError = new Error(error);
            customError.httpStatusCode = 500;

            return next(customError);
        });
};

exports.postCartDeleteProduct = (request, response, next) => {
    let id = request.body.id;
    request.user
        .removeFromCart(id)
        .then(() => response.redirect('/cart'))
        .catch(error => {
            const customError = new Error(error);
            customError.httpStatusCode = 500;

            return next(customError);
        });
};

exports.getOrderInvoice = (request, response, next) => {
    const id = request.params.id;

    Order.findById(id)
        .then(order => {
            if (!order) {
                return next(new Error('No order found.'));
            }

            if (order.user.id.toString() !== request.user._id.toString()) {
                return next(new Error('Unauthorized'));
            }

            const invoiceName = 'invoice-' + id + '.pdf';
            const invoicePath = path.join('assets', 'invoices', invoiceName);

            const pdf = new PDFDocument();
            pdf.pipe(fs.createWriteStream(invoicePath));
            pdf.pipe(response);

            pdf.fontSize(26).text('Invoice ' + id, {
                underline: true
            });

            pdf.text('---------------------------');

            let totalPrice = 0;
            order.products.forEach(orderProduct => {
                totalPrice += orderProduct.quantity * orderProduct.product.price;
                pdf.fontSize(14).text(
                    orderProduct.product.title
                    + ' - '
                    + orderProduct.quantity
                    + ' x '
                    + '$'
                    + orderProduct.product.price
                );
            });

            pdf.text('---------');
            pdf.fontSize(20).text('Total Price: $' + totalPrice);

            pdf.end();

            response.setHeader('Content-Type', 'application/pdf');
            response.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
        })
        .catch(error => next(error));
}
