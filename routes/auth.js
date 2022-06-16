const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);
router.post(
    '/login'
    , [
        body('email')
            .isEmail()
            .withMessage('check the email')
            .normalizeEmail()
            .custom(value => {
                return User.findOne({ email: value })
                    .then(user => {
                        if (!user) {
                            return Promise.reject('invalid email')
                        }
                    })
            })
        , body('password', 'check the password')
            .isAlphanumeric()
            .isLength({ min: 3 })
            .trim()
            .custom((value, { req }) => {
                return User.findOne({ email: req.body.email })
                    .then(user => {
                        if (value !== user.password) {
                            return Promise.reject('wrong password')
                        } else {
                            return true
                        }
                    })
            })
    ]
    , authController.postLogin
);

router.post('/logout', authController.postLogout);

module.exports = router;
