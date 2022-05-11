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
    .catch(err => next(err))
}

exports.passAuthData = (req, res, next) => {
  res.locals.isAuth = req.session.isLoggedIn,
  res.locals.isManager = req.session.isManager,
  res.locals.csrfToken = req.csrfToken() 
  next()
}