const mongoose = require('mongoose')

const Schema = mongoose.Schema

const productSchema = new Schema({
  title : {
    type : String,
    required : true 
  },
  imageUrl : String,
  price : Number,
  description : String
})

module.exports = mongoose.model('Product', productSchema)



// mgs uses Models -> connect to schema
// (reflected_entity's name , defined entity's schema)
