const express = require('express');
const { check, body } = require('express-validator');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);
router.post(
    '/login',
    check('email').isEmail().normalizeEmail()
    , check('password').isAlphanumeric().trim()
    , [
        check('email')
            .isEmail()
            .withMessage('check the email')
            .normalizeEmail()
        , body('password', 'check the password')
            .isAlphanumeric()
            .isLength({ min: 3 })
            .trim()
    ]
    , authController.postLogin
);

router.post('/logout', authController.postLogout);

module.exports = router;
