const User = require('../models/user');

exports.passUser = (req, res, next) => {
    console.log(req.session.user)
    if (!req.session.user) {
      return next()
    }
    User.findById(req.session.user._id)
    .then(user => {
        req.user = user 
        next()
    })
    .catch(err => console.log(err));
}

exports.passAuthData = (req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn,
  res.locals.csrfToken = req.csrfToken() 
  next()
}

// res's 'locals' field -> pass only_exist_in_V var into every rendered Views