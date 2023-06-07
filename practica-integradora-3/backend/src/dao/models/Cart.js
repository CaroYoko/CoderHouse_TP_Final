import mongoose, { Schema, model} from "mongoose";

const cartSchema = new Schema({
  products: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref:"Product"
        },
        quantity: Number
      }
    ],
    default: []
  }

});

const cartModel = model('Cart', cartSchema);

export default cartModel