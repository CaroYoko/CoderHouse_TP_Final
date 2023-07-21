import { Router } from "express";

const routerLoggerTest = Router();

routerLoggerTest.get('/', (req, res) => {
  req.logger.fatal("fatal");
  req.logger.error("error");
  req.logger.warning("warning");
  req.logger.debug("debug");
  req.logger.http("http");
  req.logger.info("info");
  res.send("logger ok")
});

export default routerLoggerTest