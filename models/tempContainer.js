
const fs = require('fs');
const path = require('path');

const pathToFile = path.join(
    path.dirname(require.main.filename), 
    'data', 
    'products.json' 
)

const getProductsFromFile = cb => {
    fs.readFile(pathToFile, (err, fileContent) => {
        err ? cb([]) : cb(JSON.parse(fileContent))
    })
}

module.exports = class Product { 
    constructor(title) { 
        this.title = title
    } 

    save() {
        getProductsFromFile( products => { // products = parsed data from file
            products.push(this)
            fs.writeFile(pathToFile, JSON.stringify(products), err => {
                console.log(err) // cb is needed
            })
        }) 
    }

    static fetchAll(cb) {
        getProductsFromFile(cb)
    }
}




