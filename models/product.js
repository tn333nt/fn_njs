const fs = require('fs');
const path = require('path');

const Cart = require('./cart');

const p = path.join(
  path.dirname(require.main.filename),
  'data',
  'products.json'
);

const getProductsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, price, description) {
    this.id = id
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  save() {
    getProductsFromFile(products => {
      if (this.id) {
        const productIndex = products.findIndex(p => p.id === this.id)

        const updatedProducts = [...products]
        updatedProducts[productIndex] = this

        fs.writeFile(p, JSON.stringify(updatedProduct), () => { });
      } else {
        this.id = Math.random().toString()
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), () => { });
      }
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    getProductsFromFile(products => {
      const product = products.find(product => product.id === id) 
      cb(product)
    })
  }

  static deleteById(id) {
    getProductsFromFile(products => {
      const product = products.find(product => product.id === id)
      const updatedProducts = products.filter(product => product.id !== id) 

      fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
        if(!err) {
          Cart.deleteProduct(id, product.price)
        }
      })
    })
  }
};
