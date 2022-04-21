const path = require('path')
const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
    res.render('shop') // use defined TE to return template from set place (main-dir)
}) 

module.exports = router