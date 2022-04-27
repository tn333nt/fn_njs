const Sequelize = require('sequelize')

const sequelize = require('../util/database')

const cart = sequelize.define('cart', {
    id: { 
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    }
})

module.exports = cart