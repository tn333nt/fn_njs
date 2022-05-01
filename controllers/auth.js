const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator/check')

const User = require('../models/user');

exports.getSignup = (req, res, next) => {
  let msg = req.flash('err')
  msg && msg.length>0 ? msg=msg[0] : msg=null
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
    errMsg: msg
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  const errors = validationResult(req) 

  if(!errors.isEmpty()) {
    return res.status(422) 
    .render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      isAuthenticated: false,
      errMsg: errors.array()[0].msg
    });
  }

  User.findOne({ email: email })
    .then(data => {
      if (data) {
        req.flash('err', 'valid user')
        return res.redirect('/signup')
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
    })
}

exports.getLogin = (req, res, next) => {
  let msg = req.flash('err')
  msg && msg.length > 0 ? msg=msg[0] : msg=null 
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false,
    errMsg: msg
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password

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
            return res.redirect('/login') 
          })
      } 
      req.flash('err', 'invalid mail')
      return res.redirect('/login')
    })
}

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/');
  })
}

