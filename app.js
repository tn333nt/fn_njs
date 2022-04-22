const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')
const expHbs = require('express-handlebars')

const app = express()

app.engine('hbs', expHbs()) // register new not-built-in TE (name, initialise f)
app.set('view engine', 'hbs') 
app.set('views', 'views') 

const adminData = require('./routes/admin')
const shopData = require('./routes/shop')

app.use(bodyParser.urlencoded({extended: true})) 
app.use(express.static(path.join(__dirname, 'public'))) 

app.use('/admin', adminData.router)
app.use(shopData)

app.use((req,res) => {
    res.status(404).render('404', { pageTitle : 404 })
})

app.listen(3000) 
