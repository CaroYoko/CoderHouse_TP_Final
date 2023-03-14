import { Router } from "express";
import ManagerMessage from "../dao/mongoDB/controllers/MessageManager.js";

const routerSocket = Router()
const messageManager = new ManagerMessage();
routerSocket.get("/", (req,res) => {
    res.render("chat", {})
})

routerSocket.get("/messages", async(req,res) => {
  const allMessages = await messageManager.getElements();
  res.send(allMessages);
})

export default routerSocket