import {Schema, model} from "mongoose";

const cartSchema = new Schema({
   products:{
    type: [{products: String, quantity: Number}],
    default: []
  } 

});

const cartModel = model('Carts', cartSchema);

export default cartModel