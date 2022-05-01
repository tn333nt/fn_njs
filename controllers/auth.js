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
  const confirmPassword = req.body.confirmPassword

  User.findOne({ email: email})
  .then(data => {
    if (data) {
      return res.redirect('/signup')
    }
    const user = new User({
      email: email,
      password: password
    })
    return user.save()
  })
  .then(() => res.redirect('/login'))
}

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
      req.session.save(() => { 
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

