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


const env = config;
const app = express();
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
app.use(cookieParser(env.cookie));
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use('/', express.static(__dirname + '/public'));
app.use("/", router);

app.set("port", env.port);

app.listen(app.get("port"), () => console.log(`Server on port ${app.get("port")}`));



