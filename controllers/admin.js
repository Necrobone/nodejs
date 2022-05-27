const { validationResult } = require('express-validator');
const Product = require('../models/product');
const fileHelper = require('../utils/file');

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

exports.postAddProduct = (request, response, next) => {
    const title = request.body.title;
    const image = request.file;
    const price = request.body.price;
    const description = request.body.description;

    if (!image) {
        return response
            .status(422)
            .render('admin/edit-product', {
                title: 'Add Product',
                path: '/admin/add-product',
                editing: false,
                hasError: true,
                product: {
                    title,
                    price,
                    description
                },
                error: 'Attached file is not an image.',
                validationErrors: [],
                formsCSS: true
            });
    }

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response
            .status(422)
            .render('admin/edit-product', {
                title: 'Add Product',
                path: '/admin/add-product',
                editing: false,
                hasError: true,
                product: {
                    title,
                    price,
                    description
                },
                error: errors.array()[0].msg,
                validationErrors: errors.array(),
                formsCSS: true
            });
    }

    const imageUrl = image.path;

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
        .catch(error => {
            const customError = new Error(error)
            customError.httpStatusCode = 500;

            return next(customError);
        });
};

exports.getEditProduct = (request, response, next) => {
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
        .catch(error => {
            const customError = new Error(error);
            customError.httpStatusCode = 500;

            return next(customError);
        });
};

exports.postEditProduct = (request, response, next) => {
    const id = request.body.id;
    const title = request.body.title;
    const image = request.file;
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

            if (image) {
                fileHelper.deleteFile(product.imageUrl);
                product.imageUrl = image.path;
            }

            return product.save()
                .then(result => {
                    console.log('UPDATED PRODUCT');
                    response.redirect('/admin/products');
                }).catch(error => {
                    const customError = new Error(error);
                    customError.httpStatusCode = 500;

                    return next(customError);
                });
        })
        .catch(error => {
            const customError = new Error(error);
            customError.httpStatusCode = 500;

            return next(customError);
        });
};

exports.deleteProduct = (request, response, next) => {
    const id = request.params.id;
    let imageUrl;

    Product.findById(id)
        .then(product => {
            if (!product) {
                return next(new Error('Product not found'));
            }

            imageUrl = product.imageUrl;

            return Product.deleteOne({id: id, user: request.user._id});
        })
        .then(() => {
            return fileHelper.deleteFile(imageUrl);
        })
        .then(() => {
            console.log('DELETED PRODUCT');
            response.status(200).json({
                message: 'Success',
            });
        })
        .catch(error => {
            response.status(500).json({
                message: 'Deleting product failed'
            });
        });
};

exports.getProducts = (request, response, next) => {
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
        .catch(error => {
            const customError = new Error(error);
            customError.httpStatusCode = 500;

            return next(customError);
        });
};
