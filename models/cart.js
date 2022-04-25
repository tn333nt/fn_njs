const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(require.main.filename),
    'data',
    'carts.json'
)

module.exports = class Cart {
    static addProduct(id, productPrice) {
        fs.readFile(p, (err, fileContent) => {
            let cart = {
                products: [],
                totalPrice: 0
            }
            if (!err) {
                cart = JSON.parse(fileContent)
            }

            const productIndex = cart.products.findIndex(p => p.id === id) 
            const existingProduct = cart.products[productIndex]
            let updatedProduct;

            if (existingProduct) {
                updatedProduct = { ...existingProduct }
                updatedProduct.quantity += 1

                cart.products = [...cart.products] 
                cart.products[productIndex] = updatedProduct
            } else {
                updatedProduct = {
                    id: id,
                    quantity: 1
                }
                cart.products = [...cart.products, updatedProduct]
            }
            cart.totalPrice += +productPrice
            fs.writeFile(p, JSON.stringify(cart), () => { })
        })
    }

    static deleteProduct(id, productPrice) {
        fs.readFile(p, (err, fileContent) => {
            let cart = {}
            if (!err) {
                cart = JSON.parse(fileContent)
                const product = cart.products.find(p => p.id === id) 
                cart.products = cart.products.filter(p => p.id !== id)
                cart.totalPrice -= (+productPrice * +product.quantity)
                fs.writeFile(p, JSON.stringify(cart), () => {})
            }
        })
    }
}


// ref
/*
static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return;
      }
      const updatedCart = { ...JSON.parse(fileContent) }; // what does that mean
      const product = updatedCart.products.find(prod => prod.id === id);
      const productQty = product.qty;
      updatedCart.products = updatedCart.products.filter(
        prod => prod.id !== id
      );
      updatedCart.totalPrice =
        updatedCart.totalPrice - productPrice * productQty;

      fs.writeFile(p, JSON.stringify(updatedCart), err => {
        console.log(err);
      });
    });
  }
*/