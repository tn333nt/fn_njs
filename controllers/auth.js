const bcrypt = require('bcryptjs')

const User = require('../models/user');

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password

  User.findOne({ email: email })
    .then(data => {
      if (data) {
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
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false
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
      return res.redirect('/login')
    })
}

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/');
  })
}

