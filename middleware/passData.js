const User = require('../models/user');

exports.passUser = (req, res, next) => {
    console.log(req.session.user)
    if (!req.session.user) { // find a user without the ss obj existing -> crash app
      return next()
    }
    User.findById(req.session.user._id)
    .then(user => { 
        if(!user) { // -> continue without user INSTEAD if can not find the user
          return next()
        }
        req.user = user 
        next()
    })
    .catch(err => {
      throw new Error(err)
    }); // only fired for technical issues (non-existing users, db is down, ...)
}

exports.passAuthData = (req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn,
  res.locals.csrfToken = req.csrfToken() 
  next()
}



/** for sync code
 * try {
 *  // try a certain code
 * } catch {
 *  // catch & handle potential err
 * }
 * 
 * ===> make sure other code keep executing even if some err is existing
 */