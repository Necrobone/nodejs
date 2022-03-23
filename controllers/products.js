const products = [];

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
    products.push({title: request.body.title});
    response.redirect('/');
};

exports.getProducts = (request, response) => {
    response.render('shop', {
        products,
        title: 'Shop',
        path: '/',
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true
    });
};

module.exports.products = products;
