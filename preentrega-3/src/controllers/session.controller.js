import UserManager from "./user.manager.js"
import jwt from "jsonwebtoken";
import { isValidPassport, createHash } from "../utils/bcrypt.js"
import passport from "passport";
import CartManager from "./cart.manager.js"
import userService from '../dao/models/User.js';
//import cartModel from "../dao/models/Cart.js";

const managerUser = new UserManager();

export const loginUser = async (req, res, next) => {
    try {
        passport.authenticate('jwt', { session: false }, async (err, user, info) => {

            console.log("En session controller", user)

            if (err) {
                return res.status(401).json({ status: "error", error: "Invalidate User" })
            }

            if (!user) {
                const { email, password } = req.body
                const userBDD = await managerUser.getUserByEmail(email)

                if (!userBDD) {
                    // UserBDD no encontrado en mi aplicacion
                    return res.status(401).send("User no encontrado")
                }

                if (!isValidPassport(password, userBDD.password)) {
                    // Contraseña no es válida
                    return res.status(401).send("Contraseña no valida")
                }

                const token = jwt.sign({ user: { id: userBDD._id } }, process.env.JWT_SECRET)
                console.log(token)
                res.cookie('jwt', token, { httpOnly: true })
                return res.status(200).json({ token })
            } else {
                const token = req.cookies.jwt;
                jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
                    if (err) {
                        // Token no valido
                        return res.status(401).send("Credenciales no válidas")
                    } else {
                        // Token valido
                        req.user = user
                        return res.status(200).send("Creedenciales validas")

                    }
                })
            }

        })(req, res, next)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const registerUser = async (req, res) => {

    try {
        const { first_name, last_name, email, age, password } = req.body;
        const userBDD = await managerUser.getUserByEmail(email);

        if (userBDD) {
            res.status(400).json("Usuario ya registrado");
        } else {

            const cartManager = new CartManager();
            const cart = await cartManager.addCart([]);
            console.log("new cart:", cart);
            const newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
                cart: cart._id
            }
            console.log("new newUser:", newUser);
            const resultUser = await userService.create(newUser);
            const token = jwt.sign({ user: { id: resultUser._id } }, process.env.JWT_SECRET);
            res.cookie('jwt', token, { httpOnly: true });
            res.status(201).json({ token });
        }
    }
    catch {
        res.status(500).send(`Ocurrio un error en Registro User, ${error}`)
    }
}

export const destroySession = (req, res) => {
    if (req.session.user) {
        req.session.destroy()
    }
    res.redirect(`${req.protocol}://${req.get('host')}/`);
}

export const getSession = (req, res) => {
    try {
        req.session.user ? res.status(200).json(req.session.user) : res.status(404).json({ message: "sesion no encontrada" });

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}