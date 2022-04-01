const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

const Database = (callback) => {
    MongoClient
        .connect('mongodb+srv://root:wUkLd5QqMMX7vQgQ@shop.bcjtd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
        .then(client => {
            console.log('CONNECTED');
            callback(client);
        })
        .catch(error => console.log(error));
}

module.exports = Database;
