const {ObjectId} = require('mongodb');
const { getDatabase } = require("../utils/database");

class Product {
    constructor(title, price, description, imageUrl, id, userId) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this._id = id ? new ObjectId(id.toString()) : null;
        this.userId = userId;
    }

    save() {
        const Database = getDatabase();

        if (this._id) {
            return Database.collection('products')
                .updateOne({_id: this._id}, {$set: this})
                .then(result => {
                    console.log(result);
                })
                .catch(error => console.log(error));
        } else {
            return Database.collection('products')
                .insertOne(this)
                .then(result => {
                    console.log(result);
                })
                .catch(error => console.log(error));
        }
    }

    static fetchAll() {
        const Database = getDatabase();
        return Database
            .collection('products')
            .find()
            .toArray()
            .then(products => {
                console.log(products);
                return products;
            })
            .catch(error => console.log(error));
    }

    static findById(id) {
        const Database = getDatabase();
        return Database
            .collection('products')
            .findOne({_id: new ObjectId(id.toString())})
            .then(product => {
                console.log(product);
                return product;
            })
            .catch(error => console.log(error));
    }

    static deleteById(id) {
        const Database = getDatabase();
        return Database
            .collection('products')
            .deleteOne({_id: new ObjectId(id.toString())})
            .then(result => {
                console.log('Deleted product');
            })
            .catch(error => console.log(error));
    }
}

module.exports = Product;
