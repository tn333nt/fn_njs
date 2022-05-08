const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const mgURI = 'mongodb+srv://test:bJYVI29LEAjl147U@cluster0.ti4jx.mongodb.net/company'
const port = 3000
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json()) // https://stackoverflow.com/a/51844327

mongoose
  .connect(mgURI)
  .then(() => app.listen(port))
  .catch(err => console.log(err))
