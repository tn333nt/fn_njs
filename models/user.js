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

    static findByPk(userId) {
    const db = getDb()
    return db.collection('users')
        .findOne({ _id: ObjectId(userId.trim()) })
}
}

module.exports = User