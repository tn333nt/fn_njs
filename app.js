const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.set('view engine', 'pug') 
app.set('views', 'views') 

const adminData = require('./routes/admin')
const shopData = require('./routes/shop')

app.use(bodyParser.urlencoded({extended: true})) 
app.use(express.static(path.join(__dirname, 'public'))) 

app.use('/admin', adminData.router)
app.use(shopData)

app.use((req,res) => {
    res.status(404).sendFile(path.join(__dirname,'views', '404.html'))
})

app.listen(3000) 
