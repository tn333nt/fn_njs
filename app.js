
const http = require('http')
const express = require('express')
const app = express() // initialise a new obj that will be stored & managed by expjs

const server = http.createServer(app)

server.listen(3000) 
