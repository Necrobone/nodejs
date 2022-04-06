const mongoDB = require('mongodb');
const {getDatabase} = require("../utils/database");
const {ObjectId} = require("mongodb");

class User {
    constructor(name, email, cart, id) {
        this.name = name;
        this.email = email;
        this.cart = cart ? cart : {products: []};
        this._id = id ? new ObjectId(id) : null;
    }

    save() {
        const Database = getDatabase();
        return Database.collection('users')
            .insertOne(this)
            .then(result => {
                console.log(result);
            })
            .catch(error => console.log(error));
    }

    addToCart(product) {
        const cartProducts = [...this.cart.products];
        const cartProductIndex = cartProducts.findIndex(item => {
            return item._id.toString() === product._id.toString();
        });

        if (cartProductIndex >= 0) {
            cartProducts[cartProductIndex].quantity++;
        } else {
            cartProducts.push({_id: new ObjectId(product._id), quantity: 1});
        }

        const cart = {
            products: cartProducts
        };

        const Database = getDatabase();
        return Database.collection('users')
            .updateOne(
                {_id: new ObjectId(this._id)},
                {$set: {cart: cart}}
            );
    }

    static findById(id) {
        const Database = getDatabase();
        return Database
            .collection('users')
            .findOne({_id: new mongoDB.ObjectId(id)})
            .then(user => {
                console.log(user);
                return user;
            })
            .catch(error => console.log(error));
    }
}

module.exports = User;
