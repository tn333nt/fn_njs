const express = require('express');
const { check } = require('express-validator/check'); // sub-pkgs ---> e-v obj with many props

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/signup', authController.getSignup);
router.post(
    '/signup', 
    check('email') // check which field of icmreq // --> obj
    .isEmail(), 
    // store found errs in this obj // --> mw
    authController.postSignup
);

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

router.post('/logout', authController.postLogout);

module.exports = router;