const Sequelize = require('sequelize');

const Database = new Sequelize('shop', 'root', '', {dialect: 'mysql', host: 'localhost'});

module.exports = Database;
