const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')
var mongoose = require('mongoose');

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
    const errors = validationResult(req)

    console.log(req.csrfToken(), 123);
    console.log(res.locals.csrfToken, 345);
    console.log(req._csrf, 5765);

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
                },
                validationErrors: errors.array()
            });
    }
    return bcrypt
        .hash(password, 12)
        .then(hasedPw => {
            const user = new User({
                email: email,
                password: hasedPw,
                managerId: new mongoose.Types.ObjectId('627b988970f0856aa5afec3e') // temp
            })
            return user.save()
        })
        .then(user => {
            req.session.isLoggedIn = true
            req.session.user = user
            return req.session.save(() => {
                res.redirect('/attendance')
            })
        })
        .catch(err => next(err))
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/');
    })
}
