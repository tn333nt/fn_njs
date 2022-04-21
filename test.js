const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.urlencoded({extended: true})) 

app.get('/', (req, res) => {
    res.send('<h1> hello from expjs </h1>')
})

app.post('/product', (req, res) => {
    console.log(req.body); 
    res.redirect('/') 
})
app.get('/add-product', (req, res) => {
    res.send(`<form action="/product" method="post">
    <input type="text" name="title"/>  
    <button type="submit">add product</button>          
    </form>`)
})

/**
 * we need an EXACT route when use get,post,...(path param is '/exact_domain')
 * != use : take all the route that begin with (path param is '/begin_of_any_domain')
 * => if use('/') first then end res -> all the paths point to '/' bc they r all start with '/' =)
 * => (?) so if i use get, post, ... only, does the order matter ?
 * 
 * https://stackoverflow.com/questions/15601703/difference-between-app-use-and-app-get-in-express-js
 * https://stackoverflow.com/questions/27227650/difference-between-app-use-and-router-use-in-express
 */

app.listen(3001) 