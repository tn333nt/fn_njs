const ObjectId = require('mongodb').ObjectId
const getDb = require('../util/database').getDb;

class User {
    constructor(name, email, cart, id) {
        this.name = name,
            this.email = email,
            this.cart = cart, // {items : []}
            this.id = id
    }

    save() {
        const db = getDb()
        return db.collection('products').insertOne(this)
    }

    addToCart(product) { 
        const updatedCart = { 
            items: [{ // set all of it on the fly
                ...product,
                quantity: 1 
            }]
        }
        const db = getDb()
        return db.collection('users')
            .updateOne(
                { _id : ObjectId(this._id) }, 
                { $set : { cart : updatedCart}} // set {} -> update which field in which way
            )
    }

    static findByPk(userId) {
        const db = getDb()
        return db.collection('users')
            .findOne({ _id: ObjectId(userId.trim()) })
    }
}

module.exports = User