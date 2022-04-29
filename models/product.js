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
    ref : 'user', // userId field refers to user M
    required : true
  }
})

module.exports = mongoose.model('Product', productSchema)




// relations in mgs r managed/setup by references and Models

/*
in the case u wanto populate info from the ref M :
at find out the data and bf handle it in .then() :
- select('f1 f2 -f3') : decide which fields from this M u wanto include
- populate('path_from_thisM_to_refM') : include detail info of ref M
- populate('path', 'f`1') : pick field from ref M to get
*/
