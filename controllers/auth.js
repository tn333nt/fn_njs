const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')

const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        title: 'Login',
        isAuth: false,
        errMsg: null,
        oldInput: {
            email: '',
            password: ''
        },
        validationErrors: []
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email
    const password = req.body.password

    console.log(req.session.csrfToken, 123);

    if (!errors.isEmpty()) {
        return res.status(422)
            .render('auth/login', {
                path: '/login',
                title: 'login',
                isAuth: false,
                errMsg: errors.array()[0].msg,
                oldInput: {
                    email: email,
                    password: password
                }
            });
    }
    return bcrypt
        .hash(password, 12)
        .then(hasedPw => {
            const user = new User({
                email: email,
                password: hasedPw
            })
            return user.save()
        })
        .then(user => {
            req.session.isLoggedIn = true
            req.session.user = user
            return req.session.save(() => {
                res.redirect('back'); // https://www.geeksforgeeks.org/how-to-redirect-back-to-original-url-in-node-js/
            })
        })
        .catch(err => next(err))
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/');
    })
}
