const ObjectId = require('mongodb').ObjectId
const getDb = require('../util/database').getDb;

class User {
    constructor(name, email) {
        this.name = name,
            this.email = email
    }

    save() {
        const db = getDb()
        return db.collection('products').insertOne(this)
    }

    static findByPk(id) {
    const db = getDb()
    return db.collection('users')
        .findOne({ _id: ObjectId(id.trim()) })
}
}

module.exports = User