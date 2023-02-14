import { Router } from "express";
import CartsManager from "../controllers/CartManager.js";

const routerCart = Router();
const cartsManager = new CartsManager('src/../carts.json');

routerCart.get('/:cid', async (req, res) => { 
    const producto = await cartsManager.getCartById(req.params.cid)
    console.log(producto)
    res.send(JSON.stringify(producto))
})
  
routerCart.post('/', async (req, res) => { 
    let mensaje = await cartsManager.addCart(req.body)
    res.send(mensaje)
})

routerCart.post('/:cid/product/:pid', async (req, res) => { 
    let mensaje = await cartsManager.addProductIntoCart(req.params.cid, req.params.pid)
    res.send(mensaje)
})


export default routerCart