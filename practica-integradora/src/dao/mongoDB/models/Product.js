import {Schema, model } from "mongoose";

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
    type: Date,
    required: true
  },
  category: {
    type: String,
    required: true
  }

});

const productModel = model('Products', productSchema);

export default productModel