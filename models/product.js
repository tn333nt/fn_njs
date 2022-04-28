const mongodb = require('mongodb')
const getDb = require('../util/database').getDb

class Product {
  constructor(title, imageUrl, price, description, _id) {
    this._id = _id,
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
        _id : new mongodb.ObjectId(this._id)
      }, {
        $set : this // replaces the value of a field with the specified value
      }) 
    }
    return dbOperation
    .then( data => {
      console.log('data', data);
    })
  }

  /*
  TypeError: db.collection(...).UpdateOne is not a function
  */

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
    .find({ _id : mongodb.ObjectId(id.trim())}) 
    .next()
    .then( product => {
      return product
    }) 
  }
}

module.exports = Product
