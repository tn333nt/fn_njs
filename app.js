
const express = require('express')
const app = express() 

app.use((req, res, next) => { 
    console.log('mw 1');
    next(); 
})

app.use((req, res, next) => {
    console.log('mw 2');
    res.send('<h1>hello from expjs</h1>') 
})

app.listen(3000) 

/* behind the scenes :
    app.listen = function listen() {
        const server = http.createServer(this) // pass app obj itself
        return server.listen.apply(server, argument) // take the passed arg
    }
*/
