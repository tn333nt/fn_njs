const express = require('express');
const { check , body } = require('express-validator/check'); 

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.get('/signup', authController.getSignup);
router.post(
    '/signup', 
    [
    check('email')
        .isEmail() 
        .withMessage('check the email')
        .normalizeEmail()
        .custom( value => {
            return User.findOne({ email: value }) 
            .then(data => { 
            if (data) {
                return Promise.reject('valid email') 
            }})
        })
    ,body('password', 'check the password')
        .isAlphanumeric() 
        .isLength({min:3})
        .trim()
    ,body('confirmPassword').trim()
        .custom((value, {req}) => {
            if (value === req.body.password) {
                return true
            }
            throw new Error('check the confirm')
        })
    ],
    authController.postSignup
);

router.get('/login', authController.getLogin);
router.post(
    '/login',
    check('email').isEmail().normalizeEmail()
    ,check('password').isAlphanumeric().trim()
    ,authController.postLogin
);

router.post('/logout', authController.postLogout);

module.exports = router;
