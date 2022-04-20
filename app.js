const express = require('express')
const bodyParser = require('body-parser')

const app = express()

const adminRoute = require('./routes/admin')
const shopRoute = require('./routes/shop')

app.use(bodyParser.urlencoded({extended: true})) 

app.use('/admin', adminRoute) // filter segment for paths in the same mod
app.use(shopRoute)

app.use((req,res) => {
    res.status(404).send('<h1>page not found</h1>')
})

app.listen(3000) 
