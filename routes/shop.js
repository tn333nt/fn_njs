const path = require('path')
const express = require('express')

const router = express.Router()

const shopController = require('../controllers/tempContainer');

router.get('/', shopController.getShop) 

module.exports = router