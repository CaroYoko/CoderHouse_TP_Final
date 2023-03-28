import { Schema, model, mongoose} from "mongoose";

const cartSchema = new Schema({
  products: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref:"Products"
        },
        quantity: Number
      }
    ],
    default: []
  }

});

const cartModel = model('Carts', cartSchema);

export default cartModel