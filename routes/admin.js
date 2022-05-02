const express = require('express');
const { body } = require('express-validator/check')

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/isAuth');
const User = require('../models/user');

const router = express.Router();

router.get('/products', adminController.getProducts);

router.get('/add-product', adminController.getAddProduct);
router.post(
    '/add-product', 
    [
        body('title').isString() // allow whitespace
        .isLength({min:3}).trim()
        ,body('imageUrl').isURL() // check https://www.ibm.com/docs/en/cics-ts/5.1?topic=concepts-components-url
        ,body('price').isNumeric() // allow both int & float
        ,body('description').isLength({min:3, max:300}).trim()
    ]
    , isAuth
    , adminController.postAddProduct
);

router.post('/edit-product', isAuth, adminController.postEditProduct);
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;
