const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
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
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, // empty errMsg -> keep storing icm file even if st was wrong
      'images')
  }, // set path 
  filename: (req, file, cb) => {
    // TypeError: Cannot read property 'isLoggedIn' of undefined
    // cb(null, new Date().getTime() + '-' + file.originalname)
    cb(null, new Date().toISOString().replace(/:/g,'-') + '-' + file.originalname);// A colon is an invalid character for a Windows file name & toISOString() uses colons =) // https://funix.udemy.com/course/nodejs-the-complete-guide/learn/lecture/12025856#questions/5778822
  } // rename file
})

const fileFilter = (req, file, cb) => {
  const types = ['image/png', 'image/jpeg', 'image/jpg']
  if (types.find(type => type === file.mimetype)) {
    cb(null, true) 
  }
  cb(null, false)
} // only allow certain kinds of files

// const fileFilter = (req, file, cb) => {
//   if (
//     file.mimetype === 'image/png' ||
//     file.mimetype === 'image/jpg' ||
//     file.mimetype === 'image/jpeg'
//   ) {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };


app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({
  storage: fileStorage,
  fileFilter: fileFilter
}).single('imageUrl')) // vay tuc la loi o day no cung chay vao mw xu ly err chung ha ?
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

// app.use((err, req, res, next) => { 
//   console.log(req.session, 123) // undefined
//   console.log(err.httpStatusCode, 12516) // still undefined when changing in cb in filename? what causes?
//   res.status(err.httpStatusCode).render('500', {
//     pageTitle: 500,
//     path: '/500',
//     isAuthenticated: req.session.isLoggedIn,
//     csrfToken: ''
//   });
// })

app.use((err, req, res, next) => {
  console.log('err', err); // ReferenceError: Cannot access 'imageUrl' before initialization
  res.status(500).render('500', {
    pageTitle: 500,
    path: '/500',
    isAuthenticated: req.session.isLoggedIn
  });
});

mongoose
  .connect(mgURI)
  .then(() => app.listen(3000))
  .catch(err => console.log(err))
