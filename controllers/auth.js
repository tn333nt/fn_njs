const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: req.session.isLoggedIn
  });
};

exports.postLogin = (req, res, next) => {
  User.findById('626b3817c89e1988610f6aeb')
  .then(user => {
      req.session.isLoggedIn = true
      req.session.user = user
      res.redirect('/');
    })
    .catch(err => console.log(err));
}

exports.postLogout = (req, res, next) => {
  console.log(123, req.session)
  req.session.destroy(() => {
    res.redirect('/');
  })
}

