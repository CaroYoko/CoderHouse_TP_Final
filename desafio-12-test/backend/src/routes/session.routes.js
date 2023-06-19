import { Router } from "express";
import { destroySession, loginUser, getSession, recoverPassword, forgotPassword } from "../controllers/session.controller.js";
import passport from "passport";
import { passportError } from "../utils/errorMessages.js";

const routerSession = Router()

routerSession.post("/login", loginUser);
routerSession.get("/logout", destroySession);
routerSession.get("/forgot", forgotPassword);
routerSession.get("/recover", passportError('jwt'), recoverPassword);
routerSession.get("/github", passport.authenticate('github', {scope: ['user:email']}), async(req,res) => {});
routerSession.get("/githubcallback", passport.authenticate('github', {failureRedirect: '/login'}), async(req, res) => {  
  req.session.user = req.user;
  res.redirect('/products');
});
routerSession.get("/current", getSession);

export default routerSession