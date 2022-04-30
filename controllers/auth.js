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





/**
 * ck -> identify user
 * ss -> encrypt info & store (in the memory) on server
 * and every ck in every browser is diff
 * ---> privacy & security?
 * 
 * other mechanism behind authenticating users in the web : build a web api
 */