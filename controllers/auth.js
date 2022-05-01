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
  const confirmPassword = req.body.confirmPassword
  console.log('email', email);
  console.log('password', password);

  User.findOne({ email: email})
  .then(data => {
    console.log('data', data);
    if (data) {
      return res.redirect('/signup')
    }

    return bcrypt
    .hash(password, 12) // str to be hashed + applied hashing rounds -> gen a hash pw -> async task -> give back a pm
    .then(hasedPw => {
    console.log('hasedPw', hasedPw);
      const user = new User({
        email: email,
        password: hasedPw,
        cart: {items: []}
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

