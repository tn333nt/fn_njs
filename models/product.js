const mongodb = require('mongodb')
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
    .find() 
    .toArray() 
    .then( products => {
      return products
    })
  }

  static findByPk(id) {
    console.log(id);
    const db = getDb()
    return db.collection('products')
    // .findOne({_id : new mongodb.ObjectId(id)})
    .find({ _id : mongodb.ObjectId(id.trim())}) // mgdb uses _id & objectId() to store ids
    .next()
    .then( product => {
      return product
    }) 
  }
}

module.exports = Product



/*
https://mongodb.github.io/node-mongodb-native/3.6/api/AggregationCursor.html#next

"You cannot return a cursor from a Function. 
Instead, evaluate the cursor using cursor.next() or cursor.toArray() and return the result."

*/

/*
BSONTypeError: Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer

format code
https://stackoverflow.com/questions/30051236/argument-passed-in-must-be-a-string-of-24-hex-characters-i-think-it-is
*/