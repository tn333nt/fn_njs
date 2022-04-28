const getDb = require('../util/database').getDb

class Product {
  constructor(title, imageUrl, price, description) {
    this.title = title,
    this.imageUrl = imageUrl,
    this.price = price,
    this.description = description
  }

  save() {
    const db = getDb()
    return db.collection('products')
    .insertOne(this) 
    .then( data => {
      console.log('from db1', data);
    })
  }

  static fetchAll() {
    const db = getDb()
    return db.collection('products')
    .find() // return a 'cursor?' to go through docs step by step
    .toArray() // turn all docs into arr
    .then( data => {
      console.log('from db2', data);
    })
  }
}

module.exports = Product