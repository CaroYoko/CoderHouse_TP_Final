import { Router } from "express";
import CartManagerFileSystem from "../dao/fileSystem/controllers/CartManager.js";
import CartManager from "../dao/mongoDB/controllers/CartManager.js";

const mongoDB = "MongoDB";
const routerCart = Router();
const cartsManagerMongoDB = new CartManager();
const cartsManagerFileSystem = new CartManagerFileSystem('src/../carts.json');

routerCart.get('/:cid', async (req, res) => {
    try {
        let producto;
        producto = process.env.DBSELECTION === mongoDB ?
            await cartsManagerMongoDB.getCartById(req.params.cid) :
            await cartsManagerFileSystem.getCartById(req.params.cid);
        res.send(JSON.stringify(producto));

    } catch (e) {
        res.status(500).json({ message: e.message, stack: e.stack });
    }
})

routerCart.post('/', async (req, res) => {
    try {
        let mensaje;
        mensaje = process.env.DBSELECTION === mongoDB ?
            await cartsManagerMongoDB.addCart(req.body) :
            await cartsManagerFileSystem.addCart(req.body);
        res.send(mensaje);
    } catch (e) {
        res.status(500).json({ message: e.message, stack: e.stack });
    }
})

routerCart.post('/:cid/product/:pid', async (req, res) => {
    try {
        let mensaje;
        mensaje = process.env.DBSELECTION === mongoDB ?
            await cartsManagerMongoDB.addProductIntoCart(req.params.cid, req.params.pid) :
            await cartsManagerFileSystem.addProductIntoCart(req.params.cid, req.params.pid);
        res.send(mensaje);
    } catch (e) {
        res.status(500).json({ message: e.message, stack: e.stack });
    }
})

routerCart.delete('/:cid/product/:pid', async (req, res) => {
    try {
        let mensaje;
        mensaje = process.env.DBSELECTION === mongoDB ?
            await cartsManagerMongoDB.deleteProductIntoCart(req.params.cid, req.params.pid) :
            await cartsManagerFileSystem.deleteProductIntoCart(req.params.cid, req.params.pid);
        res.send(mensaje);
    } catch (e) {
        res.status(500).json({ message: e.message, stack: e.stack });
    }
})

routerCart.put('/:cid', async (req, res) => {
    try {
        let mensaje;
        let { products } = req.body;
        mensaje = process.env.DBSELECTION === mongoDB ?
            await cartsManagerMongoDB.updateProductsIntoCart(req.params.cid, products) :
            await cartsManagerFileSystem.updateProductsIntoCart(req.params.cid, products);
        res.send(mensaje);
    } catch (e) {
        res.status(500).json({ message: e.message, stack: e.stack });
    }
})

routerCart.put('/:cid/product/:pid', async (req, res) => {
    try {
        let mensaje;
        let { cantidad } = req.body;
        mensaje = process.env.DBSELECTION === mongoDB ?
            await cartsManagerMongoDB.updateQuantityProductIntoCart(req.params.cid, req.params.pid, cantidad) :
            await cartsManagerFileSystem.updateQuantityProductIntoCart(req.params.cid, req.params.pid, cantidad);
        res.send(mensaje);
    } catch (e) {
        res.status(500).json({ message: e.message, stack: e.stack });
    }
})

routerCart.delete('/:cid', async (req, res) => {
    try {
        let mensaje;
        mensaje = process.env.DBSELECTION === mongoDB ?
            await cartsManagerMongoDB.deleteProducts(req.params.cid) :
            await cartsManagerFileSystem.deleteProducts(req.params.cid);
        res.send(mensaje);
    } catch (e) {
        res.status(500).json({ message: e.message, stack: e.stack });
    }
})

export default routerCart