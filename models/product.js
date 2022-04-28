const ObjectId = require('mongodb').ObjectId
const getDb = require('../util/database').getDb

class Product {
  constructor(_id, title, imageUrl, price, description) {
    this._id = ObjectId(_id),
    this.title = title,
    this.imageUrl = imageUrl,
    this.price = price,
    this.description = description
  }

  save() {
    const db = getDb()
    let dbOperation
    if (!this._id) {
      dbOperation = db.collection('products').insertOne(this) 
    } else {
      dbOperation = db.collection('products').updateOne({
        _id : this._id
      }, {
        $set : this 
      }) 
    }
    return dbOperation
    .then( data => {
      console.log('data', data);
    })
  }

  static fetchAll() {
    const db = getDb()
    return db.collection('products')
    .find() 
    .toArray() 
    .then( products => {
      return products
    })
  }

  static findByPk(id) {
    const db = getDb()
    return db.collection('products')
    .find({ _id : ObjectId(id.trim())}) 
    .next()
    .then( product => {
      return product
    }) 
  }
}

module.exports = Product
