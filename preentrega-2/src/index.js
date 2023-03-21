import * as dotEnv from 'dotenv';
import express from "express";
import { Server } from "socket.io";
import routerProduct from "./routes/productos.routes.js";
import routerCart from "./routes/carts.routes.js";
import routerSocket from "./routes/socket.routes.js";
import { __dirname } from "./path.js";
import MessageManager from "./dao/mongoDB/controllers/MessageManager.js";
import mongoose from 'mongoose';
import { engine } from 'express-handlebars';
import * as path from 'path';

dotEnv.config();
const app = express();
mongoose.connect(process.env.URLMONGODB);

//Middlewares
app.use(express.json()); 
app.use(express.urlencoded({extended: true}));
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, './views')); 

//Routes
app.use('/', express.static(__dirname + '/public'));
app.use('/api/products', routerProduct);
app.use('/api/carts', routerCart);
app.use("/", routerSocket);
app.set("port", process.env.PORT || 8080);

const server = app.listen(app.get("port"), () => console.log(`Server on port ${app.get("port")}`))

const io = new Server(server)

io.on("connection", async (socket) => {
    socket.on("message", async (info) => {       
        const managerMessage = new MessageManager();
        await managerMessage.addElement(info);
        const messages = await managerMessage.getElements();
        socket.emit("allMessages", messages);
    })
})

