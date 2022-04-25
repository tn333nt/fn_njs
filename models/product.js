const fs = require('fs');
const path = require('path');

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
        // products[productIndex] = this 

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
      const product = products.find(product => product.id === id) // cuz of space , not dif type =)
      console.log(typeof product.id);
      console.log(typeof id);
      console.log( product.id);
      console.log( id);
      cb(product)
    })
  }
};


/* 
  let updatedProduct = products[productIndex]
  updatedProduct += this 

--->
"[object Object][object Object]"

// sao chỗ này log cái obj ra nó có data đc trong khi chỗ file lưu nó đang dạng ntn ??
// sao data lưu dạng như này lại render đc 1 đống empty item nhỉ
// nó lắp kiểu gì vậy ?
*/