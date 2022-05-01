const express = require('express');
const { check } = require('express-validator/check'); 

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/signup', authController.getSignup);
router.post(
    '/signup', 
    [check('email').isEmail() 
    .withMessage('check the email')
    .custom((value, {req}) => {
        if (value === 'abc@abc.com') { 
            throw new Error('alo')
        }
        return true
    }), 
    check('password', 'check the password')
    .isAlphanumeric() //only allow numbers & normal char
    .isLength({min:6})
    ],
    authController.postSignup
);

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

router.post('/logout', authController.postLogout);

module.exports = router;