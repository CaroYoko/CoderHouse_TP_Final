import { Router } from "express";
import ProductManager from "../dao/mongoDB/controllers/ProductManager.js";


const routerSocket = Router();

routerSocket.get("/products", async(req,res) => {
  const productManager = new ProductManager();
  let productos = await productManager.getProducts({limit:3});

  const {docs, ...paginationData} = productos
 
  const productosFiltrado = !productos.docs ? [] : productos.docs.map( x =>({ title: x.title, description: x.description, price: x.price, code: x.code,category: x.category, stock: x.stock, thumbnail: x.thumbnail }))

  //const productosFiltrado = docs?.map( ({_id, ...rest}) => { console.log({_id, ...rest}); return rest}) ?? []; 

  res.render("home", { productos: productosFiltrado , paginationData });
});

export default routerSocket;