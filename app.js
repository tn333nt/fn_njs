const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session')
const MongodbStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorController = require('./controllers/error');
const passData = require('./middleware/passData');

const mgURI = 'mongodb+srv://test:bJYVI29LEAjl147U@cluster0.ti4jx.mongodb.net/shop'

const app = express();
const store = new MongodbStore({
  uri: mgURI,
  collection: 'sessions'
})
const csrfProtection = csrf()


app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'abc',
  resave: false,
  saveuninitialized: false,
  store: store
}))

app.use(csrfProtection)
app.use(passData.passAuthData)
app.use(passData.passUser)

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.get('/500', errorController.get500);
app.use(errorController.get404);

app.use((err, req, res, next) => { 
  res.status(err.httpStatusCode).render('500', {
    pageTitle: 'for bigger technical issues',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn
  });
})

mongoose
  .connect(mgURI)
  .then(() => app.listen(3000))
  .catch(err => console.log(err))
