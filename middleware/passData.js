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
      const err = new Error(e) 
      err.httpStatusCode = 500
      next(err) 
    })
}

exports.passAuthData = (req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn,
  res.locals.csrfToken = req.csrfToken() 
  next()
}



/** https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
 * 
 * 2xx -> op succeeded (default set when directly render a page)
201 -> resource created
 * 3xx -> redirection happened (default set when redirect)
301 -> this resource was moved permanently
 * 4xx -> client side err
401 -> not authenticated 
403 -> not authorized
404 -> not found page
422 -> invalid input
 * 5xx -> server side err

 * ===> indicate that we had some problems & we r returning info with the problem to the client
 */
