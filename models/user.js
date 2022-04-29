const ObjectId = require('mongodb').ObjectId
const getDb = require('../util/database').getDb;

class User {
    constructor(name, email, cart, id) {
        this.name = name,
            this.email = email,
            this.cart = cart, // { items : [] }
            this._id = id
    }

    save() {
        const db = getDb()
        return db.collection('users').insertOne(this)
    }

    addToCart(product) {
        console.log('addToCart', this.cart);
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
                { _id: ObjectId(this._id) },
                { $set: { cart: { items: updatedCartItems } } }
            )
    }

    getCart() {
        const db = getDb();
        const ids = this.cart.items.map(item => {
            return item.productId
        })

        return db.collection('products')
            .find({
                _id: {
                    $in: ids
                }
            })
            .toArray()
            .then(products => {
                return products.map(product => {
                    const item = this.cart.items.find(i => {
                        return i.productId.toString() === product._id.toString()
                    })
                    return { ...product, quantity: item.quantity }
                })
            })

    }

    deleteFromCart(id) {
        const updatedCartItems = this.cart.items.filter(p => {
            return p.productId.toString() !== id.toString()
            // return p.productId.toString() === id.toString()
        })
        const db = getDb()

        return db.collection('users')
            .updateOne(
                // .deleteOne(
                { _id: ObjectId(this._id) },
                { $set: { cart: { items: updatedCartItems } } }
            )
    }

    addOrder() {
        const db = getDb()
        return this.getCart() // get an arr of p
            .then(products => {
                const order = { // set oI
                    items: products,
                    user: {
                        _id: ObjectId(this._id),
                        name: this.name
                    }
                }
                return db.collection('orders').insertOne(order)
            })
            .then(() => {
                this.cart = { items: [] }
                return db.collection('users')
                    .updateOne(
                        { _id: ObjectId(this._id) },
                        { $set: { cart: { items: [] } } }
                    )
            })
    }

    static findByPk(userId) {
        console.log('findByPk', userId);
        const db = getDb()
        return db.collection('users')
            .findOne({ _id: ObjectId(userId.trim()) })
    }
}

module.exports = User




// later https://www.mongodb.com/docs/drivers/node/current/usage-examples/insertMany/