const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    cart: {
        products: [{
            product: {
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

User.methods.removeFromCart = function(id) {
    this.cart.products = this.cart.products.filter(product => {
        return product.product.toString() !== id.toString();
    });

    return this.save();
};

User.methods.addToCart = function(product) {
    const cartProducts = [...this.cart.products];
    const cartProductIndex = cartProducts.findIndex(item => {
        return item.product.toString() === product._id.toString();
    });

    if (cartProductIndex >= 0) {
        cartProducts[cartProductIndex].quantity++;
    } else {
        cartProducts.push({product: product._id, quantity: 1});
    }

    this.cart = {
        products: cartProducts
    };

    return this.save();
};

module.exports = mongoose.model('User', User);
