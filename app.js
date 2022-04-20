
const http = require('http')
const port = 3000
const routes = require('./routes')

// (1.2) create server obj
const server = http.createServer(routes.handler)

server.listen(port) // listen for any icm req in port...
