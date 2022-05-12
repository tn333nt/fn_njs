const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')
var mongoose = require('mongoose');

const User = require('../models/user');
const Report = require('../models/report');

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

    return User.findOne({ email: email })
            .then(user => {
                // have user -> compare pw
                if (user) {
                    return bcrypt
                        .compare(password, user.password) // 1. compare sai sao day => co loi nhung errors luon [] => can not read 'msg'
                        .then(matched => {
                            if (matched) {
                                console.log(matched, 111);
                                req.session.isLoggedIn = true
                                req.session.user = user
                                console.log(user,213143);
                                // if (user._id.toString() === mongoose.Types.ObjectId('627c7bce74cdc86544b3238e').toString()) {
                                //     req.session.isManager = true
                                //     console.log(req.session.isManager, 222);
                                //     return req.session.isManager
                                // } else {
                                //     return req.session.isManager = false
                                // }
                                // console.log(req.session.isManager, 333); // 3. no dang ko ra ngoai dc, return r ma nhi?
                                console.log(req.session, 123);
                                return req.session.save(() => {
                                    res.redirect('/attendance');
                                })
                            }
                            console.log('no matched');
    
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
                        })
                        .catch(err => next(err))
                }
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
            })
            .catch(err => next(err))
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/');
    })
}
