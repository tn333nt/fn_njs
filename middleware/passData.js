const User = require('../models/user');

exports.passUser = (req, res, next) => {
    console.log(req.session.user)
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
    .catch(err => {
      const err = new Error(err) // create err obj
      err.httpStatusCode = 500
      next(err) // inform that occurring err -> skip all other mw & move to an err handling mw
    })
}

exports.passAuthData = (req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn,
  res.locals.csrfToken = req.csrfToken() 
  next()
}
