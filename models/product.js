const Schema = require('mongoose').Schema

const Product = new Schema({
  title : {
    type : String,
    required : true // set some structure
  },
  imageUrl : String,
  price : Number,
  description : String
})

module.exports = Product




// schema -> describe data's structure & configuration?
// type : https://mongoosejs.com/docs/schematypes.html