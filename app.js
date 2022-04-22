const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.set('view engine', 'ejs') 
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
