import { Router } from "express";
import { destroySession, loginUser, getSession } from "../controllers/session.controller.js";
import passport from "passport";

const routerSession = Router()

routerSession.post("/login", loginUser);
routerSession.get("/logout", destroySession);
routerSession.get("/github", passport.authenticate('github', {scope: ['user:email']}), async(req,res) => {});
routerSession.get("/githubcallback", passport.authenticate('github', {failureRedirect: '/login'}), async(req, res) => {  
  req.session.user = req.user;
  res.redirect('/products');
});
routerSession.get("/current", getSession);

export default routerSession