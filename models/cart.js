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
}