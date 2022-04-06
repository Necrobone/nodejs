const mongoDB = require('mongodb');
const { getDatabase } = require("../utils/database");
const { ObjectId } = require("mongodb");

class User {
    constructor(name, email, cart, id) {
        this.name = name;
        this.email = email;
        this.cart = cart;
        this._id = id ? new mongoDB.ObjectId(id) : null;
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
        // const cartProduct = this.cart.items.findIndex(item => {
        //     return item._id === product._id;
        // });

        const updatedCart = {
            products: [{id: new ObjectId(product._id), quantity: 1}]
        };

        const Database = getDatabase();
        return Database.collection('users')
            .updateOne(
                {_id: new ObjectId(this._id)},
                {$set: {cart: updatedCart}}
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
