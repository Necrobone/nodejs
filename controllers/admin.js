const { validationResult } = require('express-validator');
const Product = require('../models/product');

exports.getAddProduct = (request, response) => {
    response.render('admin/edit-product', {
        title: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        hasError: false,
        error: null,
        validationErrors: [],
        formsCSS: true
    });
};

exports.postAddProduct = (request, response) => {
    const title = request.body.title;
    const imageUrl = request.body.imageUrl;
    const price = request.body.price;
    const description = request.body.description;
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
        return response
            .status(422)
            .render('admin/edit-product', {
                title: 'Add Product',
                path: '/admin/edit-product',
                editing: false,
                hasError: true,
                product: {
                    title,
                    imageUrl,
                    price,
                    description
                },
                error: errors.array()[0].msg,
                validationErrors: errors.array(),
                formsCSS: true
            });
    }

    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        user: request.user
    });

    product
        .save()
        .then(result => {
            console.log('CREATED PRODUCT');
            response.redirect('/admin/products');
        })
        .catch(error => console.log(error));
};

exports.getEditProduct = (request, response) => {
    const editMode = request.query.edit;
    if (!editMode) {
        return response.redirect('/');
    }

    const id = request.params.id;
    Product
        .findById(id)
        .then(product => {
            if (!product) {
                return response.redirect('/');
            }

            response.render('admin/edit-product', {
                title: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                product: product,
                hasError: false,
                error: null,
                validationErrors: [],
                formsCSS: true
            });
        })
        .catch(error => console.log(error));
};

exports.postEditProduct = (request, response) => {
    const id = request.body.id;
    const title = request.body.title;
    const imageUrl = request.body.imageUrl;
    const price = request.body.price;
    const description = request.body.description;
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
        return response
            .status(422)
            .render('admin/edit-product', {
                title: 'Edit Product',
                path: '/admin/edit-product',
                editing: true,
                hasError: true,
                product: {
                    _id: id,
                    title,
                    imageUrl,
                    price,
                    description
                },
                error: errors.array()[0].msg,
                validationErrors: errors.array(),
                formsCSS: true
            });
    }

    Product.findById(id)
        .then(product => {
            if (product.user.toString() !== request.user._id.toString()) {
                return response.redirect('/');
            }
            product.title = title;
            product.price = price;
            product.description = description;
            product.imageUrl = imageUrl;
            return product.save()
                .then(result => {
                    console.log('UPDATED PRODUCT');
                    response.redirect('/admin/products');
                }).catch(error => console.log(error));
        })
        .catch(error => console.log(error));
};

exports.postDeleteProduct = (request, response) => {
    const id = request.body.id;

    Product.deleteOne({id: id, user: request.user._id})
        .then(result => {
            console.log('DELETED PRODUCT');
            response.redirect('/admin/products');
        })
        .catch(error => console.log(error));
};

exports.getProducts = (request, response) => {
    Product
        .find({user: request.user._id})
        .then(products => {
            response.render('admin/product-list', {
                products,
                title: 'Shop',
                path: '/admin/products',
                hasProducts: products.length > 0,
                activeShop: true,
                productCSS: true
            });
        })
        .catch(error => console.log(error));
};
