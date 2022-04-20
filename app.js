const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.urlencoded({extended: true})) 

app.get('/add-product', (req, res) => {
    res.send(`<form action="/product" method="post">
                <input type="text" name="title"/>  
                <button type="submit">add product</button>          
            </form>`)
})

app.post('/product', (req, res) => { // only trigger mw for POST req
    console.log(req.body); 
    res.redirect('/') 
})

app.get('/', (req, res) => {
    res.send('<h1> hello from expjs </h1>')
})

app.listen(3000) 
