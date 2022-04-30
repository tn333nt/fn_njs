const mongoose = require('mongoose')

const Schema = mongoose.Schema

const orderSchema = new Schema({
  products : [{
    product : Object,
    quantity : Number,
  }],
  user : {
    name : String,
    userId : {
        type : Schema.Types.ObjectId,
        ref : 'user', 
        required : true
      }
  }
})

module.exports = mongoose.model('order', orderSchema)

