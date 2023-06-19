
import CartManager from "./cart.manager.js";

const cartsManagerMongoDB = new CartManager();

class CartController {
  
  async getCartById (req, res) {
    try {
      let mensaje = await cartsManagerMongoDB.getCartById(req.params.cid);
      res.status(200).json(mensaje);
    } catch (e) {
      res.status(500).json({ message: e.message, stack: e.stack });
    }
  }

  async addCart (req, res) {
    try {
      let mensaje = await cartsManagerMongoDB.addCart(req.body);
      res.status(200).json(mensaje);
    } catch (e) {
      res.status(500).json({ message: e.message, stack: e.stack });
    }
  }

  async addProductIntoCart (req, res) {
    try {
      let mensaje = await cartsManagerMongoDB.addProductIntoCart(req.params.cid, req.params.pid, req.user);
      res.status(200).json(mensaje);
    } catch (e) {
      res.status(500).json({ message: e.message, stack: e.stack });
    }
  }

  async deleteProductIntoCart (req, res) {
    try {
      let mensaje = await cartsManagerMongoDB.deleteProductIntoCart(req.params.cid, req.params.pid);
      res.status(200).json(mensaje);
    } catch (e) {
      res.status(500).json({ message: e.message, stack: e.stack });
    }
  }

  async updateProductsIntoCart(req, res) {
    try {
      let { products } = req.body;
      let mensaje = await cartsManagerMongoDB.updateProductsIntoCart(req.params.cid, products);
      res.status(200).json(mensaje);
    } catch (e) {
      res.status(500).json({ message: e.message, stack: e.stack });
    }
  }

  async updateQuantityProductIntoCart (req, res) {
    try {
      let { cantidad } = req.body;
      let mensaje = await cartsManagerMongoDB.updateQuantityProductIntoCart(req.params.cid, req.params.pid, cantidad);
      res.status(200).json(mensaje);
    } catch (e) {
      res.status(500).json({ message: e.message, stack: e.stack });
    }
  }

  async deleteAllProductsIntoCart(req, res) {
    try {
      let mensaje = await cartsManagerMongoDB.deleteAllProductsIntoCart(req.params.cid);
      res.status(200).json(mensaje);
    } catch (e) {
      res.status(500).json({ message: e.message, stack: e.stack });
    }
  }

  async finalizePurchase(req, res) {
    try {
      let mensaje = await cartsManagerMongoDB.finalizePurchase(req.params.cid, req.user);
      res.status(200).json(mensaje);
    } catch (e) {
      res.status(500).json({ message: e.message, stack: e.stack });
    }
  }
}

export default CartController;