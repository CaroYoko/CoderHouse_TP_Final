import { Router } from "express";
import passport from "passport";
const routerPassport = Router();

routerPassport.post('/register', passport.authenticate('register', { failureRedirect: '/failregister' }, async (req, res) => {
    res.status(200).json({ status: "success", message: "User registered" })
}))
routerPassport.get('/failregister', async (req, res) => {
    console.log("failed strategy");
    res.status(400).json({ error: "failed" });
})
routerPassport.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin' }), async (req, res) => {
    if (!req.user) return res.status(400).json({ status: "error", error: "Invalid credentials" });
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email
    }
    res.status(200).json({ status: "success", payload: req.user });
})
routerPassport.get('/faillogin', (req, res) => {
    res.status(400).json({ error: "Failed login" });
});

export default routerPassport