import { promises as fs } from 'fs';
import cartModel from '../dao/models/Cart.js';
import ProductManager from "./product.manager.js";

class CartManager {

  constructor() {
    this.model = cartModel;
  };

  async addCart(nuevoCarrito) {
    let carrito = new this.model(nuevoCarrito);
    await this.model.collection.insertOne(carrito);
    return carrito;
  }

  async getCarts() {
    return await this.model.find().exec();
  };

  async getCartById(id) {
    return await this.model.findById(id).populate('products.product').exec();
  };

  async addProductIntoCart(idCarrito, idProducto) {
    let productManager = new ProductManager();
    let carrito = await this.getCartById(idCarrito);

    if (!carrito.products) { carrito.products = []; }
    let productoEnCarrito = carrito.products.find(x => x.product === idProducto);

    if (productoEnCarrito) {
      productoEnCarrito.quantity++;
    } else {
      const product = await productManager.getProductById(idProducto);
      if(!product) { throw new Error("El producto no existe") }
      carrito.products.push({ product: idProducto, quantity: 1 });
    }
    return await carrito.save();
  };

  async deleteProductIntoCart(idCarrito, idProducto) {
    let carrito = await this.getCartById(idCarrito);

    if (!carrito.products) { carrito.products = []; }
    let productoEnCarrito = carrito.products.find(x => x.product === idProducto);

    if (productoEnCarrito && productoEnCarrito.quantity > 1) {
      productoEnCarrito.quantity--;
      
    } else if(productoEnCarrito.quantity == 1) {      
      const products = carrito.products.find((item) => item.product !== idProducto);
      carrito.products = products;
    }
    return await carrito.save();
  };

  async updateProductsIntoCart(idCarrito, products) {

    let carrito = await this.getCartById(idCarrito);
    if (!carrito.products) { carrito.products = []; }
    carrito.products = products;  
    return await carrito.save();
  }

  async updateQuantityProductIntoCart(idCarrito, idProducto, cantidad) {
    
    let carrito = await this.getCartById(idCarrito);    
    if (!carrito.products) { carrito.products = []; }
    let productoEnCarrito = carrito.products.find(x => x.product === idProducto);
    if(!productoEnCarrito) { throw new Error("El producto no existe") }
    productoEnCarrito.quantity = cantidad;
    return await carrito.save();
  }

  async deleteAllProductsIntoCart(idCarrito) {
    let carrito = await this.getCartById(idCarrito);    
    if (!carrito.products) { carrito.products = []; }
    carrito.products = [];  
    return await carrito.save();
  }

}

export default CartManager;

