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
        const idx = this.cart.items.findIndex(p => {
            return p.productId.toString() === product._id.toString() // '_' is not exactly a str
        }) // return idx of p if these values r matched
        
        const updatedCartItems = [...this.cart.items]

        if (idx < 0) {
            updatedCartItems.push({
                productId: ObjectId(product._id),
                quantity: 1
            })
        } else {
            updatedCartItems[idx].quantity += 1
        }

        const db = getDb()
        return db.collection('users')
            .updateOne(
                { _id : ObjectId(this._id) }, 
                { $set : { cart : {items : updatedCartItems} } } 
            )
    }

    static findByPk(userId) {
        const db = getDb()
        return db.collection('users')
            .findOne({ _id: new ObjectId(userId) })
    }
}

module.exports = User