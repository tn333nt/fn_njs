const Cart = require('./cart');
const db = require('../util/database')

module.exports = class Product {
  constructor(id, title, imageUrl, price, description) {
    this.id = id
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  save() {
    
  }

  static fetchAll() {
    return db.execute('SELECT * FROM products') // bring it outside to use somewhere else
  }

  static findById(id) {
    
  }

  static deleteById(id) {
    
  }
};
