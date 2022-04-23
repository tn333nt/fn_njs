const Product = require('../models/tempContainer')

exports.getProduct = (req, res) => { 
    const url = req.url
    res.render('add-product', { 
        pageTitle : 'add product', 
        path : url
    })
}

exports.postProduct = (req, res) => { 
    const product = new Product(req.body.title) 
    product.save() 
    res.redirect('/') 
} 

exports.getShop = (req, res) => {
    const products = Product.fetchAll() 
    const url = req.url
    res.render('shop', { 
        products : products, 
        pageTitle : 'shop', 
        path : url
    })
}