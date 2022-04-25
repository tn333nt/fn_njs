const mysql = require('mysql2')

const pool = mysql.createPool({ // manage multiple connections
    host: 'localhost',
    user: 'root',
    name: 'node-udemy',
    password: 'thtltcbtst111'
})

exports.module = pool.promise() // handle async data when working with pool