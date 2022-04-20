// files reached by admin

const express = require('express')

const router = express.Router()

router.get('/add-product', (req, res) => { 
    res.send(`<form action="/admin/product" method="post">
                <input type="text" name="title"/>  
                <button type="submit">add product</button>          
            </form>`)
})

router.post('/product', (req, res) => { 
    console.log(req.body); 
    res.redirect('/') 
})

module.exports = router
