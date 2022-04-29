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
                { _id : ObjectId(this._id) }, 
                { $set : { cart : {items : updatedCartItems} } } 
            ) 
    }

    getCart() {
        const db = getDb();
        const ids = this.cart.items.map(item => {
            return item.productId
        }) 

        return db.collection('products')
            .find({ _id : {
                $in : ids 
            }})
            .toArray()
            .then( products => {
                return products.map(product => { 
                    const item = this.cart.items.find(i => {
                        return i.productId.toString() === product._id.toString() 
                    })
                    return {...product, quantity : item.quantity } 
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

    static findByPk(userId) {
    console.log('findByPk', userId);
        const db = getDb()
        return db.collection('users')
            .findOne({ _id: ObjectId(userId.trim()) })
    }
}

module.exports = User



/*
TypeError: Cannot read properties of undefined (reading 'items')

transferring undefined cart 
consider where it is initialised

sao delete cho user di xong connect lai, lai loi r =))
lan nay thi giu nguyen cho addToCart r day =)))

hinh nhu loi cho connect
chay thu attached pj cung ko dc

postCart 626a42d8db5c5ba6c4d40355
... User {
  name: 'new',
  email: 'test@gm',
  cart: undefined,
  _id: new ObjectId("626b3817c89e1988610f6aeb")
}
ro rang cho set cart co van de
*/


/*
https://stackoverflow.com/questions/4075287/node-express-eaddrinuse-address-already-in-use-kill-server
*/