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

    // console.log(errors.array()); 

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

    return User.findOne({ email: email })
        .then(user => {
            // have user -> compare pw
            if (user) {
                return bcrypt
                    .compare(password, user.password) // 1. 
                    .then(matched => {
                        if (matched) {
                            console.log(matched, 111);
                            req.session.isLoggedIn = true
                            req.session.user = user
                            if (req.user._id.toString() === mongoose.Types.ObjectId('627b988970f0856aa5afec3e').toString()) {
                                return req.session.isManager = true 
                            }
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
            // not have user -> create new one
            return bcrypt
                .hash(password, 12)
                .then(hasedPw => {
                    const user = new User({
                        email: email,
                        password: hasedPw,
                        managerId: new mongoose.Types.ObjectId('627b988970f0856aa5afec3e'),
                        reports: [
                            {
                                reportId: {
                                    
                                }
                            } // 2.
                        ]
                    })
                    console.log(user);
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
        })
        .catch(err => next(err))
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/');
    })
}
