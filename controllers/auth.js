const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator/check')

const User = require('../models/user');

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
    errMsg: msg,
    oldInput: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationErrors: []
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(422)
      .render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        isAuthenticated: false,
        errMsg: errors.array()[0].msg,
        oldInput: {
          email: email,
          password: password,
          confirmPassword: req.body.confirmPassword
        },
        validationErrors: errors.array()
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
    .then(() => res.redirect('/login'))
}

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false,
    errMsg: 'errors.array()[0].msg',
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

  if (!errors.isEmpty()) {
    return res.status(422)
      .render('auth/login', {
        path: '/login',
        pageTitle: 'login',
        isAuthenticated: false,
        errMsg: errors.array()[0].msg,
        oldInput: {
          email: email,
          password: password
        },
        validationErrors: errors.array()
      });
  }

  User.findOne({ email: email })
    .then(user => {
      if (user) {
        return bcrypt
          .compare(password, user.password)
          .then(matched => {
            if (matched) {
              req.session.isLoggedIn = true
              req.session.user = user
              return req.session.save(() => {
                res.redirect('/');
              })
            }

            return res.status(422)
              .render('auth/login', {
                path: '/login',
                pageTitle: 'login',
                isAuthenticated: false,
                errMsg: errors.array()[0].msg,
                oldInput: {
                  email: email,
                  password: password
                },
                validationErrors: errors.array()
              });
          })
      }
      return res.status(422)
        .render('auth/login', {
          path: '/login',
          pageTitle: 'login',
          isAuthenticated: false,
          errMsg: errors.array()[0].msg,
          oldInput: {
            email: email,
            password: password
          },
          validationErrors: errors.array()
        });
    })
}

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/');
  })
}




// 1. anyway to shorten this repeated section?
// 2. it's always go into wrong pw case & rmb consider it later==