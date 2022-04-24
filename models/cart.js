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

            // consider or add or increase quan
            const productIndex = cart.products.findIndex(p => p.id === id) 
            const existingProduct = cart.products[productIndex]

            let updatedProduct;

            if (existingProduct) {
                // increase quantity if existing
                updatedProduct = { ...existingProduct }

                updatedProduct.quantity += 1

                // replace the old one
                cart.products = [...cart.products] 

                cart.products[productIndex] = updatedProduct

            } else {
                // create new one if there is no data
                updatedProduct = {
                    id: id,
                    quantity: 1
                }

                cart.products = [...cart.products, updatedProduct]
            }
            // incease total price
            cart.totalPrice += +productPrice
            fs.writeFile(p, JSON.stringify(cart), () => { })
        })
    }
}