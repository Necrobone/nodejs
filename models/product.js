const { getDatabase } = require("../utils/database");

class Product {
    constructor(title, price, description, imageUrl) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
    }

    save() {
        const Database = getDatabase();
        return Database.collection('products')
            .insertOne(this)
            .then(result => {
                console.log(result);
            })
            .catch(error => console.log(error));
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
}

module.exports = Product;
