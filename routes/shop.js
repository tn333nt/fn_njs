const path = require('path')
const express = require('express')

const rootDir = require('../utilities/path')
const adminData = require('./admin')

const router = express.Router()

router.get('/', (req, res) => {
    console.log('from shop.js', adminData.products); // dis : store data in var will make it be used everywhere the app is running -> not secure
    res.sendFile(path.join(rootDir, 'views', 'shop.html'))
}) 

module.exports = router