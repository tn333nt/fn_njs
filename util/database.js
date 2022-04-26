const Sequelize = require('sequelize') // constructor f 

const sequelize = new Sequelize( // new instance 
    'node-udemy',
    'root',
    'thtltcbtst111',
    {dialect : mysql}
)

module.exports = sequelize

// execute all sql code behind the scenes 
// map these code into objects