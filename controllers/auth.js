const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
  console.log(req.session.user);
  User.findById('626b3817c89e1988610f6aeb')
  .then(user => {
      req.session.isLoggedIn = true
      req.session.user = user
      req.session.save(() => { // bc create ss = writing data to db , takes longer time
        res.redirect('/');
      })
    })
    .catch(err => console.log(err));
}

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/');
  })
}

