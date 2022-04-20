
const http = require('http')
const express = require('express')
const app = express() 

app.use((req, res, next) => { 
    console.log('mw 1');
    next(); // allow req to go to the next OF NEXT func/mw
})

app.use((req, res, next) => {
    console.log('mw 2');
    res.send('<h1>hello from expjs</h1>') // set default type of content = text/html
})

const server = http.createServer(app)

server.listen(3000) 
