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
        .custom( value => {
            return User.findOne({ email: value }) 
            .then(data => { // every then block implicitly returns a new Pm & e-v will wait for this pm to be fulfilled
            if (data) {
                return Promise.reject('valid email') // detect & store rejection as an err
            }})
        })
    ,body('password', 'check the password')
        .isAlphanumeric() 
        .isLength({min:3})
    ,body('confirmPassword')
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


/*
node:internal/process/promises:265
            triggerUncaughtException(err, true (fromPromise) 

[UnhandledPromiseRejection: This error originated either by throwing inside of an async function without a 
catch block, or by rejecting a promise which was not handled with .catch(). The promise rejected with the reason "valid email".] {
  code: 'ERR_UNHANDLED_REJECTION'
}
*/