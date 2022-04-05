const mongoDB = require('mongodb');
const { getDatabase } = require("../utils/database");

class Product {
    constructor(title, price, description, imageUrl, id) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this._id = id ? new mongoDB.ObjectId(id) : null;
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
            .findOne({_id: new mongoDB.ObjectId(id)})
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
            .deleteOne({_id: new mongoDB.ObjectId(id)})
            .then(result => {
                console.log('Deleted product');
            })
            .catch(error => console.log(error));
    }
}

module.exports = Product;
