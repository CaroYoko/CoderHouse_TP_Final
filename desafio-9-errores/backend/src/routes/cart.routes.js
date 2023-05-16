import { Router } from "express";
import CartController from '../controllers/cart.controller.js'
import { passportError, current } from "../utils/errorMessages.js";

const cartController = new CartController();
const routerCart = Router();

routerCart.get('/:cid', cartController.getCartById.bind(cartController));
routerCart.post('/', cartController.addCart.bind(cartController));
routerCart.post('/:cid/product/:pid', passportError('jwt'), current(['User']), cartController.addProductIntoCart.bind(cartController));
routerCart.delete('/:cid/product/:pid', cartController.deleteProductIntoCart.bind(cartController));
routerCart.put('/:cid', cartController.updateProductsIntoCart.bind(cartController));
routerCart.put('/:cid/product/:pid', cartController.updateQuantityProductIntoCart.bind(cartController));
routerCart.delete('/:cid', cartController.deleteAllProductsIntoCart.bind(cartController));
routerCart.post('/:cid/purchase', passportError('jwt'), cartController.finalizePurchase.bind(cartController)); //post?

export default routerCart;