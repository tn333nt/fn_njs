const path = require('path')
const express = require('express')

const productController = require('../controllers/tempContainer')

const router = express.Router()

router.get('/add-product', productController.getProduct)

router.post('/product', productController.postProduct)

module.exports = router
