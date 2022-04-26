const Sequelize = require('sequelize');

const sequelize = require('../util/database')

const Product = sequelize.define('product', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  title: {
    type: 'string',
    allowNull: false
  },
  imageUrl: Sequelize.STRING,
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  description: Sequelize.TEXT
}) // config each field as obj

module.exports = Product