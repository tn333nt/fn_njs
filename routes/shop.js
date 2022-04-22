const path = require('path')
const express = require('express')

const router = express.Router()

const adminData = require('./admin');

router.get('/', (req, res) => {
    const products = adminData.products
    res.render('shop', { products : products, shopTilte : 'shop'}) // view, data (stored in obj)
}) 

module.exports = router