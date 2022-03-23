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
    constructor(title) {
        this.title = title;
    }

    save() {
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
}
