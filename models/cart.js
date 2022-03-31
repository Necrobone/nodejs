const Sequelize = require('sequelize');
const Database = require('../utils/database');

const Cart = Database.define('cart', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
});

module.exports = Cart;
