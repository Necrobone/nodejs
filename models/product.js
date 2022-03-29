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
    constructor(id, title, imageUrl, price, description) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
    }

    save() {
        getProducts(products => {
            if (this.id) {
                const existingProductIndex = products.findIndex(product => product.id === this.id);
                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;
                fs.writeFile(database, JSON.stringify(updatedProducts), (error) => {
                    console.log(error);
                });
            } else {
                this.id = Math.random().toString();
                products.push(this);

                fs.writeFile(database, JSON.stringify(products), (error) => {
                    console.log(error);
                });
            }
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
