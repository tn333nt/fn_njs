const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);
router.get('/products/:productId', shopController.getProduct) 

router.get('/cart', shopController.getCart);
router.post('/cart', shopController.postCart);

router.post('/delete-cart', shopController.deleteCart);

router.get('/orders', shopController.getOrders);
router.get('/create-order', shopController.createOrder);

router.get('/checkout', shopController.getCheckout);

module.exports = router;
