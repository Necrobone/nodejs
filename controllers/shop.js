const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const Product = require('../models/product');
const Order = require('../models/order');

const ITEMS_PER_PAGE = 2;

exports.getIndex = (request, response, next) => {
    const page = request.query.page;

    Product.find()
        .skip((page -1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
        .then(products => {
            response.render('shop/index', {
                products: products,
                title: 'Shop',
                path: '/',
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
    Product.find()
        .then(products => {
            response.render('shop/product-list', {
                products: products,
                title: 'All Products',
                path: '/products',
                productCSS: true
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

exports.postOrders = (request, response, next) => {
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
