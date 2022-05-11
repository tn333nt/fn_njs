const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session')
const MongodbStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')
const multer = require('multer');

const managerRoutes = require('./routes/manager');
const employeeRoutes = require('./routes/employee');
const authRoutes = require('./routes/auth');
const passData = require('./middlewares/passData');

const mgURI = 'mongodb+srv://test:bJYVI29LEAjl147U@cluster0.ti4jx.mongodb.net/company'
const port = 3000
const app = express();

const csrfProtection = csrf();

app.set('view engine', 'ejs');

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use(multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
      cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname)
    }
  }),
  fileFilter: (req, file, cb) => {
    const types = [
      'image/png', 
      'image/jpeg', 
      'image/jpg'
    ]
    types.find(type => type === file.mimetype) ? cb(null, true) : cb(null, false)
  }
})
  .single('image'))


app.use(session({
  secret: 'abc',
  resave: false,
  saveUninitialized: false,
  store: new MongodbStore({
    uri: mgURI,
    collection: 'loginSessions'
  })
}))
app.use(csrfProtection)
app.use(passData.passAuthData)
app.use(passData.passUser)

app.use(managerRoutes);
app.use(employeeRoutes);
app.use(authRoutes);

// err handlers
app.use((req, res, next) => {
  res.status(404).render('err/404', {
    title: 404,
    path: '/404',
    isAuth: req.session.isLoggedIn
  });
});
app.use((err, req, res, next) => {
  console.log(err.message);
  res.status(err.status || 500).render('err/500', {
    title: 500,
    path: '/500',
    isAuth: req.session.isLoggedIn
  });
});

mongoose
  .connect(mgURI)
  .then(() => app.listen(port))
  .catch(err => console.log(err))
