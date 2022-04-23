const Product = require('../models/tempContainer')

exports.getProduct = (req, res) => { 
    const url = req.url
    console.log(url);
    res.render('add-product', { 
        pageTitle : 'add product', 
        path : url
    })
}

exports.postProduct = (req, res) => { 
    const product = new Product(req.body.title) // create instance -> pass param into obj constructor
    product.save() // save data from instance to f inside
    res.redirect('/') 
} 

exports.getShop = (req, res) => {
    const products = Product.fetchAll() // call returning f without initilising newObj to use the Class?
    const url = req.url
    console.log(url);
    res.render('shop', { 
        products : products, 
        pageTitle : 'shop', 
        path : url
    })
}