const Sequelize = require('sequelize') 

const sequelize = new Sequelize( 
    'node-udemy',
    'root',
    'thtltcbtst111',
    {dialect : mysql}
)

module.exports = sequelize
