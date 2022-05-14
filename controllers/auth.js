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
    const errors= validationResult(req)

    console.log(errors.array(), 123) 

    return User.findOne({ email: email })
        .then(user => {
            if (user) {
                return bcrypt
                    .compare(password, user.password)
                    .then(matched => {
                        if (matched) {
                            req.session.isLoggedIn = true
                            req.session.user = user

                            if (user._id.toString() === mongoose.Types.ObjectId('627c644af847400f53e77fe0').toString()) {
                                req.session.isManager = true
                            } else {
                                req.session.isManager = false
                            }

                            return req.session.save(() => {
                                res.redirect('/attendance');
                            })
                        }
                        console.log('no matched');
                        console.log(errors.array(), 'errors.array()')

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
    req.session.destroy(() => res.redirect('/'))
}
