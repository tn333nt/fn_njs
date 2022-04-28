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
    return db
    .collection('products')
    .insertOne(this) 
    .then( data => {
      console.log('from db', data);
    })
  }
}

module.exports = Product