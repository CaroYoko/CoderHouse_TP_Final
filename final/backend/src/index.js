import config from '../config.js';
import express from "express";
import { __dirname } from "./path.js";
import mongoose from 'mongoose';
import { engine } from 'express-handlebars';
import * as path from 'path';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import router from './routes/index.routes.js';
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import { onError } from './middlewares/index.js'
import { addLogger, logger } from './utils/logger.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import cors from 'cors';

const whiteList = ['http://localhost:3001'] //Rutas validas a mi servidor

const corsOptions = { //Reviso si el cliente que intenta ingresar a mi servidor esta o no en esta lista
  origin: (origin, callback) => {
    // Verificar si el origen está en la lista blanca
    if (whiteList.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
  /*
    if (whiteList.indexOf(origin) !== -1) {
        callback(null, true)
    } else {
        callback(new Error('Not allowed by Cors'))
    }*
    callback(null, true) 
    */
}


const env = config;
const app = express();
//CORS
app.use(cors(corsOptions));

mongoose.connect(env.mongoURL);

//Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: "E-Commerce Carolina Yokoyama",
      decription: "Proyecto final del curso de programación Back-end de CoderHouse"
    }
  },
  apis: [`${__dirname}/docs/**/*.yaml`]
}
const specs = swaggerJSDoc(swaggerOptions)
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, './views'));

app.use(cookieParser(env.jwt));
app.use(passport.initialize());
initializePassport();
app.use(addLogger);

//Routes
app.use('/', express.static(__dirname + '/public'));
app.use("/", router);
app.use(onError);

app.set("port", env.port);

app.listen(app.get("port"), () => logger.info(`Server on port ${app.get("port")}`));



