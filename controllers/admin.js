const Product = require('../models/product');

exports.getAddProduct = (request, response) => {
    response.render('admin/add-product', {
        title: 'Add Product',
        path: '/admin/add-product',
        activeAddProduct: true,
        formsCSS: true,
        productCSS: true
    });
};

exports.postAddProduct = (request, response) => {
    const title = request.body.title;
    const imageUrl = request.body.imageUrl;
    const price = request.body.price;
    const description = request.body.description;

    const product = new Product(title, imageUrl, price, description);
    product.save();

    response.redirect('/');
};

exports.getProducts = (request, response) => {
    Product.fetchAll(products => {
        response.render('admin/product-list', {
            products,
            title: 'Shop',
            path: '/',
            hasProducts: products.length > 0,
            activeShop: true,
            productCSS: true
        });
    });
};
