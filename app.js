const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.set('view engine', 'ejs') 
app.set('views', 'views') 

const adminRoute = require('./routes/admin')
const shopRoute = require('./routes/shop')
const errController = require('./controllers/errors')

app.use(bodyParser.urlencoded({extended: true})) 
app.use(express.static(path.join(__dirname, 'public'))) 

app.use('/admin', adminRoute)
app.use(shopRoute)

app.use(errController.get404)

app.listen(3000) 
