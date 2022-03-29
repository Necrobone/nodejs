const Cart = require('./cart');
const Database = require('../utils/database');

module.exports = class Product {
    constructor(id, title, imageUrl, price, description) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
    }

    save() {
        return Database.execute('INSERT INTO products (title, price, description, imageUrl) VALUES (?, ?, ?, ?)', [
            this.title,
            this.price,
            this.description,
            this.imageUrl,
        ]);
    }

    static deleteById(id) {
    }

    static fetchAll() {
        return Database.execute('SELECT * FROM products');
    }

    static findById(id) {
        return Database.execute('SELECT * FROM products WHERE id = ?', [id]);
    }
}
