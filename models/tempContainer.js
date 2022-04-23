
const fs = require('fs');
const path = require('path');

module.exports = class Product { 
    constructor(title) { 
        this.title = title
    } 

    save() {
        const pathToStore = path.join(
            path.dirname(require.main.filename), 
            'data', 
            'products.json'
            )
        fs.readFile(pathToStore, (err, fileContent) => { // this fileContent is a buffer
            let products = [] 
            if (!err) {
                products = JSON.parse(fileContent) 
            }
            products.push(this) 
            fs.writeFile(pathToStore, JSON.stringify(products), err => {
                console.log(err); 
                console.log(products.length);
            })
        })
    }

    static fetchAll(cb) { 
        const pathToStore = path.join(
            path.dirname(require.main.filename), 
            'data', 
            'products.json' // remember extension =))
            )
        fs.readFile(pathToStore, (err, fileContent) => {
            return err ? cb([]) : cb(JSON.parse(fileContent))
        })
    }
}