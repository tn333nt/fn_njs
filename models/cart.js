const Sequelize = require('sequelize')

const sequelize = require('../util/database')

const cart = sequelize.define('cart', {
    id: { 
        type: Sequelize.STRING,
        primaryKey: true,
        // autoIncrement: true, // str thi aI kieu gi dc =)
        allowNull: false
    }
})

module.exports = cart