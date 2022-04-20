const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.urlencoded({extended: true})) // return mw -> parse urlcoded body into string
/* 
version 4.16+ -> change T to F for remove [Object: null prototype] 
    (pass no param to http req -> object.prototype that inherits to objs is empty)

F -> parse & format url query strings (querystring) 
T -> parse & stringify & addad security (qs) (more options but basically they r same)

returned obj by querystring.parse() does not prototypically inherit from js obj
-> obj.toString(), ... are not defined and will not work -> null prototype

https://stackoverflow.com/questions/29960764/what-does-extended-mean-in-express-4-0
*/

app.use('/add-product', (req, res) => {
    res.send(`<form action="/product" method="post">
                <input type="text" name="title"/>  
                <button type="submit">add product</button>          
            </form>`)
})

app.use('/product', (req, res) => {
    console.log(req.body); // parsed body from parser
    res.redirect('/') // status code + location
})

app.use('/', (req, res) => {
    res.send('<h1> hello from expjs </h1>')
})

app.listen(3000) 
