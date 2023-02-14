import express from "express";
import routerProduct from "./routes/productos.routes.js";
import routerCart from "./routes/carts.routes.js";
import { __dirname } from "./path.js";

const app = express();
const PORT = 8080; 

//Middlewares
app.use(express.json()); 
app.use(express.urlencoded({extended: true}));

//Routes
app.use('/static', express.static(__dirname + '/public'));
app.use('/api/products', routerProduct);
app.use('/api/carts', routerCart);

app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})