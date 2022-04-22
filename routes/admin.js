const path = require('path')
const express = require('express')

const rootDir = require('../utilities/path')

const router = express.Router()

const products = []

router.get('/add-product', (req, res) => { 
    res.render('add-product', { 
        pageTilte : 'add product', 
        path : '/admin/add-product',
        activeAddProduct : true,
        formCSS : true
    })
})

router.post('/product', (req, res) => { 
    products.push({ title : req.body.title })
    res.redirect('/') 
})

module.exports = {
    router: router,
    products: products
}
