const User = require('../models/user');

exports.passUser = (req, res, next) => {
    if (!req.session.user) { 
      return next()
    }
    User.findById(req.session.user._id)
    .then(user => { 
        if(!user) { 
          return next()
        }
        req.user = user 
        next()
    })
    .catch(e => {
      throw new Error('abc')
    })
}

exports.passAuthData = (req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn,
  res.locals.csrfToken = req.csrfToken() 
  next()
}
