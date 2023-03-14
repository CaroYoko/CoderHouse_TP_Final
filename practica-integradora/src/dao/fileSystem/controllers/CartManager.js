//const fs = require('fs').promises;

import { promises as fs } from 'fs';
import Cart from '../models/Cart.js';
import ProductManager from "./ProductManager.js";

class CartManager {  
  
  constructor(path){
    this.path = path;
  };   
  
  async addCart(nuevoCarrito) {
    const exist = await fs.stat(this.path).catch(error => {            
      if(error.code !== 'ENOENT') throw new Error("Hubo un error");       
      return false;     
    });

    if(exist){
      let carritos = await this.getCarts();     
      let carrito = new Cart(nuevoCarrito.products);
      carritos.push(carrito);
      await fs.writeFile(this.path, JSON.stringify(carritos));
    };
  }
  
  async getCarts(){
    let contenidoTxt = await fs.readFile(this.path, 'utf-8'); 
    let carritos = JSON.parse(contenidoTxt);  
    return carritos.map(x => new Cart(x.products, x.id));
  };

  async getCartById(id){
    let carritos =  await this.getCarts();
    const carrito = carritos.find(x => x.obtenerId == parseInt(id));
    if(!carrito) throw new Error(`ID cart: ${id} Not found`);
    return carrito;
  };
  
  async addProductIntoCart(idCarrito, idProducto){
    let productManager = new ProductManager('src/../productos.json');
    let carritos =  await this.getCarts();
    idCarrito = parseInt(idCarrito);
    idProducto = parseInt(idProducto);
    
    let carrito =  carritos.find(x => x.id === idCarrito);  
    if(!carrito) throw new Error(`ID cart: ${idCarrito} Not found`);
    let productoEnCarrito = carrito.products.find(x => x.idProduct === idProducto);
   
    if(productoEnCarrito){
      productoEnCarrito.quantity++;     
    } else{
      await productManager.getProductById(idProducto);       
      carrito.products.push({idProduct: idProducto, quantity: 1});    
    }
    
    await fs.writeFile(this.path, JSON.stringify(carritos));    
    return carrito;
  };
 
}

export default CartManager;

