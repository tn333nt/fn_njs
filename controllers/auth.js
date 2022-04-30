exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: req.isLoggedIn
  });
};

exports.postLogin = (req, res, next) => {
  req.isLoggedIn = true // end req's lifecycle right after set info
  res.redirect('/');
}



// intent : pass checker through req then check in nav if the user is logged in
// but : we r working with totally separate reqs
