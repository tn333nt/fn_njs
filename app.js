const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session')
const MongodbStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')

const managerRoutes = require('./routes/manager');
const employeeRoutes = require('./routes/employee');
const authRoutes = require('./routes/auth');
const passData = require('./middleware/passData');

const mgURI = 'mongodb+srv://test:bJYVI29LEAjl147U@cluster0.ti4jx.mongodb.net/company'
const port = 3001
const app = express();

const csrfProtection = csrf() // https://www.npmjs.com/package/csurf#csurfoptions

app.set('view engine', 'ejs');

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))

app.use(session({
  resave: false,
  saveuninitialized: false,
  store: new MongodbStore({
    uri: mgURI,
    collection: 'loginSessions'
  })
}))
app.use(csrfProtection)
app.use(passData.passAuthData)

app.use(managerRoutes);
app.use(employeeRoutes);
app.use(authRoutes);

mongoose
  .connect(mgURI)
  .then(() => app.listen(port))
  .catch(err => console.log(err))
