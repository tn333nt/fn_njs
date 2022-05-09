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
const passData = require('./middleware/passData');

const mgURI = 'mongodb+srv://test:bJYVI29LEAjl147U@cluster0.ti4jx.mongodb.net/company'
const port = 3001
const app = express();

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
  resave: false,
  saveuninitialized: false,
  store: new MongodbStore({
    uri: mgURI,
    collection: 'loginSessions'
  })
}))
app.use(csrf())
app.use(passData.passAuthData)

app.use(managerRoutes);
app.use(employeeRoutes);
app.use(authRoutes);

mongoose
  .connect(mgURI)
  .then(() => app.listen(port))
  .catch(err => console.log(err))
