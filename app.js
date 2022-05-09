const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const managerRoutes = require('./routes/manager');
const employeeRoutes = require('./routes/employee');
const authRoutes = require('./routes/auth');

const mgURI = 'mongodb+srv://test:bJYVI29LEAjl147U@cluster0.ti4jx.mongodb.net/company'
const port = 3000
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))

app.use(managerRoutes);
app.use(employeeRoutes);
app.use(authRoutes);

mongoose
  .connect(mgURI)
  .then(() => app.listen(port))
  .catch(err => console.log(err))
