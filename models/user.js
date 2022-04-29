const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
  name : String,
  email : String,
  cart : {
    items : [{
        productId : { type : Schema.Types.ObjectId , ref : 'Product', required : true },
        quantity : { type : Number, required : true }
    }]
  }
})

module.exports = mongoose.model('user', userSchema)
