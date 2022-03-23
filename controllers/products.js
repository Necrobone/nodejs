const Product = require('../models/product');

exports.getAddProduct = (request, response) => {
    response.render('add-product', {
        title: 'Add Product',
        path: '/admin/add-product',
        activeAddProduct: true,
        formsCSS: true,
        productCSS: true
    });
};

exports.postAddProduct = (request, response) => {
    const product = new Product(request.body.title);
    product.save();

    response.redirect('/');
};

exports.getProducts = (request, response) => {
    Product.fetchAll(products => {
        response.render('shop', {
            products,
            title: 'Shop',
            path: '/',
            hasProducts: products.length > 0,
            activeShop: true,
            productCSS: true
        });
    });
};
