
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
        fs.readFile(pathToStore, (err, fileContent) => {
            const products = [] // store new data temporarily?
            console.log(err, fileContent);
            if (!err) {
                products = JSON.parse(fileContent) // parse data from file
            }
            products.push(this) // append new data to file
            fs.writeFile(pathToStore, JSON.stringify(products), err => {
                console.log(err); // no err
            }) // parse data to save to file?
        })
        
    }

    static fetchAll() { 
        const pathToStore = path.join(
            path.dirname(require.main.filename), 
            'data', 
            'products'
            )
        fs.readFile(pathToStore, (err, fileContent) => {
            return err ? [] : JSON.parse(fileContent); // return data from file
            // if (err) {
            //     return []
            // }
            // return JSON.parse(fileContent)
        })
    }
}