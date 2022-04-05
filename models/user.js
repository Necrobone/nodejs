const mongoDB = require('mongodb');
const { getDatabase } = require("../utils/database");

class User {
    constructor(name, email, id) {
        this.name = name;
        this.email = email;
        this._id = id ? new mongoDB.ObjectId(id) : null;
    }

    save() {
        const Database = getDatabase();
        return Database.collection('users')
            .insertOne(this)
            .then(result => {
                console.log(result);
            })
            .catch(error => console.log(error));
    }

    static findById(id) {
        const Database = getDatabase();
        return Database
            .collection('users')
            .findOne({_id: new mongoDB.ObjectId(id)})
            .then(user => {
                console.log(user);
                return user;
            })
            .catch(error => console.log(error));
    }
}

module.exports = User;
