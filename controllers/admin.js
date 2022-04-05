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

    const product = new Product(title, price, description, imageUrl);

    product
        .save()
        .then(result => {
            console.log('Product Created!');
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
    request.user
        .getProducts({where: {id: id}})
        .then(products => {
            const product = products[0];
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
        .catch(error => console.log(error));
};

exports.postEditProduct = (request, response) => {
    const id = request.body.id;
    const title = request.body.title;
    const imageUrl = request.body.imageUrl;
    const price = request.body.price;
    const description = request.body.description;

    Product.findByPk(id)
        .then(product => {
            product.title = title;
            product.imageUrl = imageUrl;
            product.price = price;
            product.description = description;
            return product.save();
        })
        .then(result => {
            console.log('UPDATED PRODUCT');
            response.redirect('/admin/products');
        })
        .catch(error => console.log(error));
};

exports.postDeleteProduct = (request, response) => {
    const id = request.body.id;

    Product.findByPk(id)
        .then(product => {
            return product.destroy();
        })
        .then(result => {
            console.log('DELETED PRODUCT');
            response.redirect('/admin/products');
        })
        .catch(error => console.log(error));
};

exports.getProducts = (request, response) => {
    request.user
        .getProducts()
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
