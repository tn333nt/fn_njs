const express = require('express')
const app = express() 

// app.use(['startOfDomainChar',] callback [, callback(s)])
app.use('/', (req, res, next) => { // apply to all req
    console.log('abc');
    next()
})

app.use('/add-product', (req, res, next) => {
    res.send('<h1> the add product page </h1>') 
}) // need to register first or it will never be reached bc res => end stream => only take '/' case

app.use('/', (req, res, next) => {
    res.send('<h1> hello from expjs </h1>') 
})

app.listen(3000) 
