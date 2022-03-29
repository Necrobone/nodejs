const fs = require('fs');
const path = require('path');
const database = path.join(path.dirname(process.mainModule.filename), 'data', 'cart.json');

module.exports = class Cart {
    static addProduct(id, productPrice) {
        // Fetch the previous cart
        fs.readFile(database, (error, fileContent) => {
            // Create a local empty cart
            let cart = {products: [], totalPrice: 0};

            // Replace the cart with the database cart
            if (!error) {
                cart = JSON.parse(fileContent);
            }

            // Analyze the cart => find existing product in the database cart
            const existingProductIndex = cart.products.findIndex(product => product.id === id);
            const existingProduct = cart.products[existingProductIndex];

            // Add new product / increase quantity
            let updatedProduct;
            // If product exist in the cart
            if (existingProduct) {
                // Product is the existing product, quantity +1
                updatedProduct = { ...existingProduct };
                updatedProduct.quantity = updatedProduct.quantity + 1;

                // Replace the updated product in the cart
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                // If product does not exist in the cart, create it and add it to the cart
                updatedProduct = { id: id, quantity: 1};
                cart.products = [...cart.products, updatedProduct];
            }

            // Update total price of cart
            cart.totalPrice = cart.totalPrice + +productPrice;

            // Save it to the database
            fs.writeFile(database, JSON.stringify(cart), error => {
                console.log(error);
            })
        });
    }
}
