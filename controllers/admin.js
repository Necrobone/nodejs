const Product = require('../models/product');

exports.getAddProduct = (request, response) => {
    response.render('admin/edit-product', {
        title: 'Add Product',
        path: '/admin/add-product',
        editing: false,
    });
};

exports.postAddProduct = (request, response) => {
    const title = request.body.title;
    const imageUrl = request.body.imageUrl;
    const price = request.body.price;
    const description = request.body.description;

    const product = new Product(null, title, imageUrl, price, description);
    product.save();

    response.redirect('/');
};

exports.getEditProduct = (request, response) => {
    const editMode = request.query.edit;
    if (!editMode) {
        return response.redirect('/');
    }

    const id = request.params.id;
    Product.findById(id, product => {
        if (!product) {
            return response.redirect('/');
        }

        response.render('admin/edit-product', {
            title: 'Edit Product',
            path: '/admin/edit-product',
            editing: editMode,
            product: product,
        });
    })
};

exports.postEditProduct = (request, response) => {
    const id = request.body.id;
    const title = request.body.title;
    const imageUrl = request.body.imageUrl;
    const price = request.body.price;
    const description = request.body.description;

    const product = new Product(id, title, imageUrl, price, description);
    product.save();

    response.redirect('/admin/products');
};

exports.getProducts = (request, response) => {
    Product.fetchAll(products => {
        response.render('admin/product-list', {
            products,
            title: 'Shop',
            path: '/admin/products',
            hasProducts: products.length > 0,
            activeShop: true,
            productCSS: true
        });
    });
};
