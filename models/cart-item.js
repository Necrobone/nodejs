const Sequelize = require('sequelize');
const Database = require('../utils/database');

const CartItem = Database.define('cartItem', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
});

module.exports = CartItem;
