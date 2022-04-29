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

userSchema.methods // add own methods
.addToCart = function(product) {
  const idx = this.cart.items.findIndex(item => item.productId.toString() === product._id.toString())
  const updatedCartItems = [...this.cart.items]
  if (idx < 0) {
    updatedCartItems.push({
      productId : product._id,
      quantity : 1
    })
  } else {
    updatedCartItems[idx].quantity += 1
  }

  this.cart.items = updatedCartItems
  return this.save()
}

module.exports = mongoose.model('user', userSchema)
