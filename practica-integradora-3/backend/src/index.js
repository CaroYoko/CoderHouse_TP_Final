import config from '../config.js';
import express from "express";
import { __dirname } from "./path.js";
import mongoose from 'mongoose';
import { engine } from 'express-handlebars';
import * as path from 'path';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import router from './routes/index.routes.js';
import session from 'express-session';
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import {onError} from './middlewares/index.js'
import { addLogger, logger } from './utils/logger.js';
/*
import cors from 'cors';

const whiteList = ['http://localhost:3000'] //Rutas validas a mi servidor

const corsOptions = { //Reviso si el cliente que intenta ingresar a mi servidor esta o no en esta lista
    origin: (origin, callback) => {
        if (whiteList.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by Cors'))
        }
    }
}
*/

const env = config;
const app = express();
//CORS
//app.use(cors(corsOptions));

mongoose.connect(env.mongoURL);

//Middlewares
app.use(express.json()); 
app.use(express.urlencoded({extended: true}));
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, './views')); 

app.use(session({
  store:MongoStore.create({
    mongoUrl:env.mongoURL,
    mongoOptions:{useNewUrlParser:true, useUnifiedTopology:true},
    ttl:15
  }),
  secret:env.session,
  resave:true,
  saveUninitialized:true
}));

app.use(cookieParser(env.jwt));
app.use(passport.initialize());
app.use(passport.session());
initializePassport();
app.use(addLogger);

//Routes
app.use('/', express.static(__dirname + '/public'));
app.use("/", router);
app.use(onError);

app.set("port", env.port);

app.listen(app.get("port"), () => logger.info(`Server on port ${app.get("port")}`));



