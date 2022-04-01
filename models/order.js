const Sequelize = require('sequelize');
const Database = require('../utils/database');

const Order = Database.define('order', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
});

module.exports = Order;
