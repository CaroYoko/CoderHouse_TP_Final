import UserManager from "./user.manager.js"
import jwt from "jsonwebtoken";
import { isValidPassword, createHash } from "../utils/bcrypt.js"
import passport from "passport";
import CartManager from "./cart.manager.js"
import userService from '../dao/models/User.js';
//import cartModel from "../dao/models/Cart.js";
//import CustomError from "../errors/customError.js"
//import EErrors from "../errors/enums.js"
import { generateUserErrorInfo, generateUserExistErrorInfo, generateLoginErrorInfo } from "../errors/info.js"
import {InvalidParamsError, UnauthorizedError, DICTIONARY_ERROR, translate} from "../utils/error.js"
import logger from '../utils/logger.js';


const managerUser = new UserManager();

export const loginUser = async (req, res, next) => {
    try {
        passport.authenticate('jwt', { session: false }, async (err, user, info) => {
            try {

                if (err) {
                    throw new UnauthorizedError(DICTIONARY_ERROR.INVALID_USER);
                }
                
                if (!user) {
                    const { email, password } = req.body
                    const userBDD = await managerUser.getUserByEmail(email)

                    if (!userBDD) {
                        // UserBDD no encontrado en mi aplicacion
                        
                        throw new UnauthorizedError(translate(DICTIONARY_ERROR.USER_NOT_FOUND, email));
                    }

                    if (!isValidPassword(password, userBDD.password)) {
                        // Contraseña no es válida                        
                        
                        throw new UnauthorizedError(DICTIONARY_ERROR.INVALID_PASSWORD);
                    
                    }
                    const token = jwt.sign({ user: { id: userBDD._id } }, process.env.JWT_SECRET)
                    res.cookie('jwt', token, { httpOnly: true })
                    return res.status(200).json({ token })
                } else {
                    const token = req.cookies.jwt;

                    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
                        if (err) {
                            // Token no valido                           
                            throw new InvalidParamsError(DICTIONARY_ERROR.INVALID_TOKEN);

                        } else {
                            // Token valido
                            req.user = user
                            return res.status(200).send("Creedenciales validas")

                        }
                    })
                }
            } catch (error) {
                next(error);
            }

        })(req, res, next)

    } catch (error) {
        next(error);

    }
}

export const registerUser = async (req, res, next) => {

    try {
        const { first_name, last_name, email, age, password } = req.body;

        if (!first_name || !last_name || !email || !age || !password) {

            throw new InvalidParamsError(translate(DICTIONARY_ERROR.INVALID_PARAMS, first_name, last_name, email));

        }

        const userBDD = await managerUser.getUserByEmail(email);

        if (userBDD) {

            throw new InvalidParamsError(translate(DICTIONARY_ERROR.USER_EXIST, email));

        } else {

            const cartManager = new CartManager();
            const cart = await cartManager.addCart([]); 
            const newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
                cart: cart._id
            }
            logger.info(`new newUser: ${newUser}`); 

            const resultUser = await userService.create(newUser);
            const token = jwt.sign({ user: { id: resultUser._id } }, process.env.JWT_SECRET);
            res.cookie('jwt', token, { httpOnly: true });
            res.status(201).json({ token });
        }

    }
    catch (error) {
        next(error);

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