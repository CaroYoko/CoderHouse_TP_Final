import { Router } from "express";
import ProductManager from "../controllers/product.manager.js";

const routerSocket = Router();

routerSocket.get("/", async (req, res) => {
  res.render("login", { jsFiles: "/js/login.js"});  
})

routerSocket.get("/signin", async (req, res) => {
  res.render("signin", { jsFiles: "/js/signin.js"});
})

routerSocket.get("/products", async (req, res) => {
  const productManager = new ProductManager();

  if (req.session.user) {

    let productos = await productManager.getProducts({ limit: 3 });
    const userName = req.session.user.first_name;
  
    const { docs, ...paginationData } = productos;
  
    const productosFiltrado = !productos.docs ? [] : productos.docs.map(x => ({ title: x.title, description: x.description, price: x.price, code: x.code, category: x.category, stock: x.stock, thumbnail: x.thumbnai }))
  
    //const productosFiltrado = docs?.map( ({_id, ...rest}) => { console.log({_id, ...rest}); return rest}) ?? []; 
  
    res.render("home", { productos: productosFiltrado, paginationData, userName});
  }else {
    res.redirect(`${req.protocol}://${req.get('host')}/`);
  }
});

export default routerSocket;