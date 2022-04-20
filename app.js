
const http = require('http')
const express = require('express')
const app = express() 

app.use((req, res, next) => { // register mw
    console.log('mw 1');
    next(); // allow req to go to the next func/mw
})

app.use((req, res, next) => {
    console.log('mw 2');
})

const server = http.createServer(app)

server.listen(3000) 
