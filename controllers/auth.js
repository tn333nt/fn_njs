exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: req.session.isLoggedIn
  });
};

exports.postLogin = (req, res, next) => {
  req.session.isLoggedIn = true
  res.redirect('/');
}





/** uri
 * https://danielmiessler.com/study/difference-between-uri-url/#difference
 * 
 ** 
 * avt: each user -> each ck -> each ss -> ability of sharing data across reqs through each single user
 * dis : less secure when store in mmr + more limited
 */