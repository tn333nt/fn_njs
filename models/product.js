const mongoose = require('mongoose')

const Schema = mongoose.Schema

const productSchema = new Schema({
  title : {
    type : String,
    required : true 
  },
  imageUrl : String,
  price : Number,
  description : String,
  userId : {
    type : Schema.Types.ObjectId,
    ref : 'user', 
    required : true
  }
})

module.exports = mongoose.model('Product', productSchema)

