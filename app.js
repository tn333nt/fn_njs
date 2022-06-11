const express = require('express')

const feedRoutes = require('./routes/feed')

const app = express() 
const port = 8080

app.use('feed', feedRoutes)

app.listen(port)

// new social messaging app 