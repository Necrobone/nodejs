const fs = require('fs');
const path = require('path');
const database = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');

const getProducts = (callback) => {
    fs.readFile(database, (error, filecontent) => {
        if (error || filecontent.length === 0) {
            return callback([]);
        }

        callback(JSON.parse(filecontent));
    });
};

module.exports = class Product {
    constructor(title, imageUrl, description, price) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        this.id = Math.random().toString();
        getProducts(products => {
            products.push(this);
            fs.writeFile(database, JSON.stringify(products), (error) => {
                console.log(error);
            });
        });
    }

    static fetchAll(callback) {
        getProducts(callback);
    }

    static findById(id, callback) {
        getProducts(products => {
            const product = products.find(product => product.id === id);
            callback(product);
        });
    }
}
