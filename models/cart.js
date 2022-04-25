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
            if (!err) {
                const cart = JSON.parse(fileContent)
                const product = cart.products.find(p => p.id === id) 
                cart.products = cart.products.filter(p => p.id !== id)
                cart.totalPrice -= (+productPrice * +product.quantity)
                fs.writeFile(p, JSON.stringify(cart), () => {})
            }
        })
    }

    static getCart(cb) {
        fs.readFile(p, (err, fileContent) => {
            const cart = JSON.parse(fileContent)
            err ? cb(null) : cb(cart)
        })
    }
}

/* ?
SyntaxError: Unexpected token u in JSON at position 0
=>  your app is attempting to parse undefined, which is not valid JSON

SyntaxError: Malformed arrow function parameter list in ... while compiling ejs
Or, if you meant to create an async function, pass `async: true` as an option.
*/