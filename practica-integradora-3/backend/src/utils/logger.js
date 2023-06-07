import winston from 'winston';
import config from '../../config.js';

const customLevelOpt = {
  levels: {
    fatal : 0,
    error : 1,
    warning : 2,
    info : 3,
    http: 4,
    debug : 5
  }
  /*,
  colors:{
    fatal : 'red',
    error : 'red',
    warning : 'red',
    info : 'red',
    http: 'red',
    debug : 'red'
  }*/
}

const devTransportConfig = [
  new winston.transports.Console({
    level: "debug", 
    format: winston.format.combine(winston.format.timestamp(), winston.format.printf(({ level, message, timestamp,}) =>  `${timestamp} - [${level}]: ${message}`))
  }) 
]
const prodTransportConfig = [
  new winston.transports.Console({
    level: "info", 
    format: winston.format.combine(winston.format.timestamp(), winston.format.printf(({ level, message, timestamp,}) =>  `${timestamp} - [${level}]: ${message}`))
  }) ,
  new winston.transports.File({
    level: "error",
    filename: './errors.log', 
    format: winston.format.combine(winston.format.timestamp(), winston.format.printf(({ level, message, timestamp,}) =>  `${timestamp} - [${level}]: ${message}`))      
  }) 
]

export const logger = winston.createLogger({
  levels: customLevelOpt.levels,
  transports: config.env !== "PRODUCTION" ? devTransportConfig : prodTransportConfig
})

export const addLogger = (req, _res, next) => {
  req.logger = logger;
  logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleDateString}`)  
  next();
}
