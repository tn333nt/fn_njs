const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator/check')

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
            // if exist user with this id -> return value & store in var, else 
            // User.findOne({ _id: ObjectId('626ebc84126f7a0bcce75a20') })
            // .then(user => {
            //     const managerId = user._id 
            //     return managerId
            // })
            const user = new User({
                email: email,
                password: hasedPw,
                managerId: managerId
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

// later : 
// 1. 'Đăng nhập xong thì quay lại trang trước đó, nếu không có trang trước đó thì quay về trang chủ.' 
// 2. if admin login -> return user without managerId, else within 
// 3. adjust conditions sections : if 

exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/');
    })
}
