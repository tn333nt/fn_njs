const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.get('/products', adminController.getProducts);

router.get('/add-product', adminController.getAddProduct);
router.post('/add-product', isAuth, adminController.postAddProduct);

router.post('/edit-product', isAuth, adminController.postEditProduct);
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;
