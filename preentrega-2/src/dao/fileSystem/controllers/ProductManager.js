//const fs = require('fs').promises;

import { promises as fs } from 'fs';
import Producto from '../models/Producto.js';

class ProductManager {

  constructor(path){
    this.path = path;
  };   
  
  existProduct(productos, producto){ 
    const prod = productos.find(x => x.code == producto.code);
    return prod ? true : false;  
  };

  async addProduct(nuevoProducto) {
 
    let productos = [];

    const exist = await fs.stat(this.path).catch(error => {            
      if(error.code !== 'ENOENT') throw new Error("Hubo un error");       
      return false;     
    });
    
    if(exist){
      productos = await this.getProducts();
      
      if (this.existProduct(productos, nuevoProducto)) {
        throw new Error(`${nuevoProducto.code} already exists`);
      };          
      
      let producto = new Producto(nuevoProducto.title, 
                                  nuevoProducto.description, 
                                  nuevoProducto.price, 
                                  nuevoProducto.thumbnail, 
                                  nuevoProducto.code, 
                                  nuevoProducto.stock, 
                                  nuevoProducto.status, 
                                  nuevoProducto.category);
      productos.push(producto);
    };

    await fs.writeFile(this.path, JSON.stringify(productos));
  }

  async getProducts(){
    let contenidoTxt = await fs.readFile(this.path, 'utf-8') ?? "[]";         
    let productos = JSON.parse(contenidoTxt);  
    console.log(productos);
    return productos.map(x => new Producto(x.title, x.description, x.price, x.thumbnail, x.code, x.stock, x.status, x.category, x.id));
  };

  async getProductById(id){
    let productos =  await this.getProducts();
    const producto = productos.find(x => x.obtenerId == id);
    if(!producto) throw new Error(`ID: ${id} Not found`);
    return producto;
  };

  async updateProduct(id, product){

    let productos = await this.getProducts();
    let producto =  productos.find(x => x.obtenerId == id);
    if(!producto) throw new Error(`ID: ${id} Not found`);    
    producto.title = product.title;      
    producto.description = product.description;      
    producto.price = product.price;      
    producto.thumbnail = product.thumbnail;      
    producto.code = product.code;      
    producto.stock = product.stock;
    producto.status = product.status;
    producto.category = product.category;

    await fs.writeFile(this.path, JSON.stringify(productos));    
  };

  async deleteProduct(id){
    let productos =  await this.getProducts();
    let productosFiltado =  productos.filter(x => x.obtenerId !== parseInt(id));   
    if(productos.length == productosFiltado.length) throw new Error(`ID: ${id} Not found`);
    await fs.writeFile(this.path, JSON.stringify(productosFiltado));
  }
}

export default ProductManager;

