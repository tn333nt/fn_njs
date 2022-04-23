
const products = []

module.exports = class Product { 
    constructor(title) { // store properties with input values
        this.title = title
    } 

    save() { // store data that constructed from these values
        products.push(this)
    }

    static fetchAll() { // get stored data
        return products
    }
}



/** Class ~ function constructor
    * define funcs :
        - normal f : be called through instantiated obj
        - after 'static' kw : be called directly from Class
    * constructor() :
        - run auto when a newObj is created (through instance)
        - initilise obj's props before load other methods
    * this ---> obj created based on Class ?
 */