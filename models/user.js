const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    cart: {
        products: [{
            id: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            }
        }]
    }
});

User.methods.clearCart = function() {
    this.cart = {products: []};

    return this.save();
};

User.methods.removeFromCart = function(id) {
    this.cart.products = this.cart.products.filter(product => {
        return product.id.toString() !== id.toString();
    });

    return this.save();
};

User.methods.addToCart = function(product) {
    const cartProducts = [...this.cart.products];
    const cartProductIndex = cartProducts.findIndex(item => {
        return item.id.toString() === product._id.toString();
    });

    if (cartProductIndex >= 0) {
        cartProducts[cartProductIndex].quantity++;
    } else {
        cartProducts.push({id: product._id, quantity: 1});
    }

    this.cart = {
        products: cartProducts
    };

    return this.save();
};

module.exports = mongoose.model('User', User);
