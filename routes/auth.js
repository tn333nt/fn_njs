const express = require('express');
const { check , body } = require('express-validator/check'); 

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/signup', authController.getSignup);
router.post(
    '/signup', 
    [check('email').isEmail() 
    .withMessage('check the email')
    .custom((value) => {
        if (value === 'abc@abc.com') { 
            throw new Error('alo')
        }
        return true
    }), 
    body('password', 'check the password')
    .isAlphanumeric() 
    .isLength({min:6}),
    body('confirmPassword')
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
router.post('/login', authController.postLogin);

router.post('/logout', authController.postLogout);

module.exports = router;