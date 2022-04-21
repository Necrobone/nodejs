const {getDatabase} = require("../utils/database");
const {ObjectId} = require("mongodb");

class User {
    constructor(name, email, cart, id) {
        this.name = name;
        this.email = email;
        this.cart = cart ? cart : {products: []};
        this._id = id ? new ObjectId(id.toString()) : null;
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
            cartProducts.push({_id: new ObjectId(product._id.toString()), quantity: 1});
        }

        const cart = {
            products: cartProducts
        };

        const Database = getDatabase();
        return Database.collection('users')
            .updateOne(
                {_id: new ObjectId(this._id.toString())},
                {$set: {cart: cart}}
            );
    }

    getCartProducts() {
        const Database = getDatabase();
        const ids = [];
        const quantities = {};

        this.cart.products.forEach((product) => {
            let id = product._id;

            ids.push(id);
            quantities[id] = product.quantity;
        });

        return Database
            .collection('products')
            .find({_id: {$in: ids}})
            .toArray()
            .then((products) => {
                return products.map((p) => {
                    return {...p, quantity: quantities[p._id]};
                });
            })
            .catch(error => console.log(error));
    }

    deleteCartProduct(id) {
        const Database = getDatabase();
        const removedCartProductList = {
            products: this.cart.products.filter(product => {
                return product._id.toString() !== id.toString();
            })
        };

        return Database.collection('users')
            .updateOne(
                {_id: new ObjectId(this._id.toString())},
                {$set: {cart: removedCartProductList}}
            );
    }

    addOrder() {
        const Database = getDatabase();
        return this.getCartProducts()
            .then(products => {
                const order = {
                    products: products,
                    user: {
                        _id: new ObjectId(this._id.toString()),
                        name: this.name
                    }
                };
                return Database.collection('orders').insertOne(order);
            })
            .then(result => {
                this.cart = {products: []}
                return Database.collection('users')
                    .updateOne(
                        {_id: new ObjectId(this._id.toString())},
                        {$set: {cart: this.cart}}
                    );
            })
            .catch(error => console.log(error));
    }

    getOrders() {
        const Database = getDatabase();
        return Database.collection('orders')
            .find({'user._id': new ObjectId(this._id.toString())})
            .toArray();
    }

    static findById(id) {
        const Database = getDatabase();
        return Database
            .collection('users')
            .findOne({_id: new ObjectId(id.toString())})
            .then(user => {
                console.log(user);
                return user;
            })
            .catch(error => console.log(error));
    }
}

module.exports = User;
