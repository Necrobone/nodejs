const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let _db;

const Client = (callback) => {
    MongoClient
        .connect('mongodb+srv://root:wUkLd5QqMMX7vQgQ@shop.bcjtd.mongodb.net/shop?retryWrites=true&w=majority')
        .then(client => {
            console.log('CONNECTED');
            _db = client.db();
            callback(client);
        })
        .catch(error => {
            console.log(error);
            throw error;
        });
}

const Database = () => {
    if (_db) {
        return _db;
    }
    throw 'No Database Found';
}

exports.getClient = Client;
exports.getDatabase = Database;
