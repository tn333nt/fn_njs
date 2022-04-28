const ObjectId = require('mongodb').ObjectId
const getDb = require('../util/database').getDb;

class User {
    constructor(name, email, cart, id) {
        this.name = name,
        this.email = email,
        this.cart = cart, // {items : []}
        this._id = id
    }

    save() {
        const db = getDb()
        return db.collection('products').insertOne(this)
    }

    addToCart(product) { 
        const updatedCart = { 
            items: [{ 
                productId: ObjectId(product._id),
                quantity: 1 
            }]
        }
        const db = getDb()
        return db.collection('users')
            .updateOne(
                { _id : ObjectId(this._id) }, 
                { $set : { cart : updatedCart}} 
            )
    }

    static findByPk(userId) {
        const db = getDb()
        return db.collection('users')
            .findOne({ _id: new ObjectId(userId) })
    }
}

module.exports = User