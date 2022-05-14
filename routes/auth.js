const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);
router.post(
    '/login'
    , [
        body('email')
            .isEmail()
            .withMessage('check the email')
            .normalizeEmail()
        , body('password', 'check the password')
            .isAlphanumeric()
            .isLength({ min: 3 })
            .trim()
            .custom((value, {req}) => {
                if (value === req.body.password) {
                    return true
                }
                throw new Error('unmatched password')
            })
    ]
    , authController.postLogin
);

router.post('/logout', authController.postLogout);

module.exports = router;
