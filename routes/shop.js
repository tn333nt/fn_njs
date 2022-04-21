const path = require('path')

const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'shop.html'))
}) 
// join() -> concat + correct paths
// __dirname = PATH from current file to the containing directory (the whole pj folder)

module.exports = router