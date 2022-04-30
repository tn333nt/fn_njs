exports.getLogin = (req, res, next) => {
  console.log('abc', req.get('Cookie'));
  const isLoggedIn = req.get('Cookie').trim().split('=')[1]
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: isLoggedIn ? isLoggedIn : true
  });
};

exports.postLogin = (req, res, next) => {
  res.setHeader('set-cookie', 'loggedIn=true; httponly; test=false')
  res.redirect('/');
}



/*
  cookie (ck) -> store user's data across reqs

  config -> block users to edit data from browser
  we have pkgs manage that

  common use : track users
  bc it can contain info from another pages that u have visited
*/