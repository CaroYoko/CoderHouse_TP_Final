//const fs = require('fs').promises;

import { promises as fs } from 'fs';
import cartModel from '../models/Cart.js';
import ProductManager from "./ProductManager.js";

class CartManager {  
  
  constructor(){
    this.model = cartModel;
  };   
  
  async addCart(nuevoCarrito) {
      let carrito = new this.model(nuevoCarrito);
      await this.model.collection.insertOne(carrito);  
      return carrito;    
  }
  
  async getCarts(){
    return await this.model.find().exec();
  };

  async getCartById(id){
    return await this.model.findById(id).exec();
  };

  async addProductIntoCart(idCarrito, idProducto){
    let productManager = new ProductManager();  

    let carrito = await this.getCartById(idCarrito);  
    //if(!carrito) throw new Error(`ID cart: ${idCarrito} Not found`);
    if(!carrito.products) { carrito.products = [];}
    let productoEnCarrito = carrito.products.find(x => x.id === idProducto);
   
    if(productoEnCarrito){
      productoEnCarrito.quantity++;     
    } else{
      await productManager.getProductById(idProducto);       
      carrito.products.push({idProduct: idProducto, quantity: 1});    
    }
    console.log(productoEnCarrito);
    return await carrito.save();
  };
 
}

export default CartManager;

