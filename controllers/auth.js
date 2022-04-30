exports.getLogin = (req, res, next) => {
  console.log(req.get('Cookie'), 123)
  console.log(req.get('Cookie').split(';')[0].trim().split('=')[1])
  const isLoggedIn = req.get('Cookie').split(';')[0].trim().split('=')[1]
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: isLoggedIn ? isLoggedIn : false
  });
};

exports.postLogin = (req, res, next) => {
  // req.session.cookie = 'abc'
  res.redirect('/');
}




/*
https://stackoverflow.com/a/71050114

*/
