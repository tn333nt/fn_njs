const ObjectId = require('mongodb').ObjectId
const getDb = require('../util/database').getDb;

class User {
    constructor(name, email, cart, id) {
        this.name = name,
        this.email = email,
        this.cart = cart, 
        this._id = id
    }

    save() {
        const db = getDb()
        return db.collection('products').insertOne(this)
    }

    addToCart(product) { 
        const idx = this.cart.items.findIndex(p => {
            return p.productId.toString() === product._id.toString() 
        }) 

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

    getCart() {
        const db = getDb();
        const ids = this.cart.items.map(item => {
            return item.productId
        }) // fetch all id in cart

        return db.collection('products')
            .find({ _id : {
                $in : ids // select docs where the value of _id field = any value in the specified array (ids)
            }})
            .toArray()
            .then( products => {
                return products.map(product => { // execute on every element
                    const item = this.cart.items.find(i => {
                        return i.productId.toString() === product._id.toString() // check if p of cI matches p -> return this element
                    })
                    return {...product, quantity : item.quantity } // set qty of : p-in-c (cI) = p?
                })
            })

    }

    static findByPk(userId) {
        const db = getDb()
        return db.collection('users')
            .findOne({ _id: new ObjectId(userId) })
    }
}

module.exports = User



/*
no findMany() exists :)
https://www.mongodb.com/docs/drivers/node/current/usage-examples/find/

more ab find() & cursor
https://www.mongodb.com/docs/manual/reference/method/db.collection.find/

*/