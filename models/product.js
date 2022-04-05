const mongoDB = require('mongodb');
const { getDatabase } = require("../utils/database");

class Product {
    constructor(title, price, description, imageUrl, id) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this._id = new mongoDB.ObjectId(id);
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
            .find({_id: new mongoDB.ObjectId(id)})
            .next()
            .then(product => {
                console.log(product);
                return product;
            })
            .catch(error => console.log(error));
    }
}

module.exports = Product;
