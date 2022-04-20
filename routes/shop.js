// users can visit

const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
    res.send('<h1> hello from expjs </h1>')
})

module.exports = router