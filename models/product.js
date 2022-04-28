const ObjectId = require('mongodb').ObjectId
const getDb = require('../util/database').getDb

class Product {
  constructor(id, title, imageUrl, price, description, userId) {
    this._id = id ? ObjectId(id.trim()) : null ,
    this.title = title,
    this.imageUrl = imageUrl,
    this.price = price,
    this.description = description,
    this.userId = userId
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
    .findOne({ _id : ObjectId(id.trim())}) 
    .then( product => {
      return product
    }) 
  }

  static deleteByPk(id) {
    const db = getDb()
    return db.collection('products')
    .deleteOne({ _id : ObjectId(id.trim())}) 
  }
}

module.exports = Product
