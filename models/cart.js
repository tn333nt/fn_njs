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
            // after assign file's contents into a temp store

            // const existingProduct = cart.products.find(p => p.id === id) // consider or add or increase quan
            
            const productIndex = cart.products.findIndex(p => p.id === id) 
            const existingProduct = cart.products[productIndex]

            let updatedProduct;
            if (existingProduct) {
                // increase quantity if existing
                // updatedProduct = { ...existingProduct }

                // updatedProduct = [{ ...existingProduct }]
                // updatedProduct.quantity += 1

                existingProduct.quantity += 1

                // cart.products = updatedProduct
                cart.products = existingProduct

                // replace the old one
                // cart.products = [...cart.products] // feel like it copy itself again (*)

                // cart.products[productIndex] = updatedProduct

            } else {
                // create new one if there is no data
                updatedProduct = {
                    id: id,
                    quantity: 1
                }

                // cart.products += updatedProduct // rmb that c.p is arr, uP is not (at least right now) =))
                cart.products = [...cart.products, updatedProduct]
            }
            // incease total price
            cart.totalPrice += +productPrice
            fs.writeFile(p, JSON.stringify(cart), () => { })
        })
    }
}



// (?) why we need an index in here while find() also can reach the matched product ?
/* 
    update : bc find() just can find which is the needed product, 
            but not update it (or at least just for that way)

    i think i still can use find()
*/

// (?) why not update existingP directly but go through updatedP ?
/* it just other way

    const productIndex = cart.products.findIndex( products => products.id == id );
    const existingProduct = cart.products[existingProductIndex];

    if(existingProduct) existingProduct.quantity += 1
    else cart.products.push( { id: id, quantity: 1} )

*/



/* ***TypeError: cart.products.findIndex is not a function

  "nodemonConfig": {
    "ignore": ["data/products.json","data/cart.json"]
  },
https://funix.udemy.com/course/nodejs-the-complete-guide/learn/lecture/11738896#questions/10734136

  * solve the same way with this err : (?)

TypeError: Cannot read property 'findIndex' of undefined
    "If the file exists, even being empty, fs.readFile will not return an error,
the variable cart will use the contents of an empty file and therefore findIndex
will try to loop through an array that does not exist (undefined)."


  why??? just until i delete the old carts.json and it works normal ? =)
  but my old file does not empty ?!

*/

// why the solution looks same as above ?
/* raw html page in the first time add to card
"nodemonConfig": {

          "ignore": ["data/*"]

}
https://funix.udemy.com/course/nodejs-the-complete-guide/learn/lecture/11738896#questions/10060808
it's still not work :((

*/


/* 
    TypeError: Cannot read properties of undefined (reading 'price')
    why ? sao lai ko lay dc product sau khi thu doi va update chut xong convert lai nhu cu ?

    before change : 
    {"products":[{"id":"0.5048779273537627","quantity":6}],"totalPrice":615}

    after change , it just RUN 1 TIME the update file like that : 
    {"products":{"id":"0.5048779273537627","quantity":7},"totalPrice":738}

    i see =) [] is disappered =)

    cuz of that line : cart.products = updatedProduct
    it change my p arr into obj =)
    so it can not read p arr bc now it is obj

    i change to this : updatedProduct = [ {...existingProduct} ] 
    for loop through {} inside but not the whole arr with ...eP

    but it comes to unable to update quantity bc quantity is obj inside 's prop :((
    still need idx
    no other way (follow this flow) to access right product ?
*/


/* (*)
    "Let's say you are using the same objects in several places, 
    and you make changes to the object at any one place, 
    changes will get reflected in all other places."

    => (*) ensure that this array (=original data) can never (accidentally) be mutated from any other part of the app

    https://funix.udemy.com/course/nodejs-the-complete-guide/learn/lecture/11738896#questions/7272432
*/


// ref
/*
    const idx = cart.products.findIndex(prod => prod.id === id)
    if (idx != -1) cart.products[idx].qty += 1
    else cart.products = [...cart.products, { id: id, qty: 1 }]
    cart.totalPrice = cart.totalPrice + +productPrice
    fs.writeFile(p, JSON.stringify(cart), err => console.log(err))
*/

/*
const fs = require("fs");
 
const path = require("path");
 
const Product = require("./product");
 
const c = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "cart.json"
);
 
const getProductsFromFile = cb => {
  fs.readFile(c, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};
 
module.exports = class Cart {
  static addProduct(productId) {
    const cart = [];
    getProductsFromFile(products => {
      if (products.length === 0) {
        Product.findById(productId, product => {
          products.push({ product: product, count: 1 });
          fs.writeFile(c, JSON.stringify(products), err => {});
        });
      } else {
        const product = products.find(p => p.product.id === productId);
        if (product) {
          let index = products.findIndex(p => p.product.id === productId);
          products[index].count = products[index].count + 1;
          fs.writeFile(c, JSON.stringify(products), err => {});
        } else {
          Product.findById(productId, product => {
            products.push({ product: product, count: 1 });
            fs.writeFile(c, JSON.stringify(products), err => {});
          });
        }
      }
    });
  }
};
*/