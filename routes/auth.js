const express = require('express');
const { check } = require('express-validator/check'); 

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/signup', authController.getSignup);
router.post(
    '/signup', 
    check('email') 
    .isEmail() // built-in validators https://github.com/validatorjs/validator.js
    .withMessage('look at the email')
    .custom((value, {req}) => {
        console.log(value, 'value');
        // console.log({req}, '{req}');
        if (value === 'abc@abc.com') { // notice the format:D
            throw new Error('alo')
        }
        return true
    }), 
    authController.postSignup
);

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

router.post('/logout', authController.postLogout);

module.exports = router;