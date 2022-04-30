const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
  name: String,
  email: String,
  cart: {
    items: [{
      productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true }
    }]
  }
})

userSchema.methods.addToCart = function (product) {
  const updatedCartItems = this.cart.items.filter(item => item.productId.toString() === product._id.toString())
  console.log(updatedCartItems);
  if (updatedCartItems.length <= 0) {
  console.log('if', updatedCartItems);
    updatedCartItems.push({
      productId: product._id,
      quantity: 1
    })
  } else {
  console.log('else', updatedCartItems);
    updatedCartItems[0].quantity += 1
  }
  this.cart.items = updatedCartItems
  return this.save()
}

userSchema.methods.deleteFromCart = function (id) {
  const updatedCartItems = this.cart.items.filter(item => item.productId.toString() !== id.toString())
  this.cart.items = updatedCartItems
  return this.save()
}

module.exports = mongoose.model('user', userSchema)
