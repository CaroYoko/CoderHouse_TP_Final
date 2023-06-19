import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new Schema({  

  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true    
  },
  price: {
    type: Number,
    required: true    
  },
  thumbnail:{
    type: [String],
    default: []
  },
  code: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  status:{
    type: Boolean,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  owner : {
    type: String,
    default: "Admin"
  }

});
productSchema.plugin(mongoosePaginate);
const productModel = model('Product', productSchema);

export default productModel