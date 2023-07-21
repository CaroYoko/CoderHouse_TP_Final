import UserManager from "../service/user.manager.js"
import jwt from "jsonwebtoken";
import { isValidPassword, createHash } from "../utils/bcrypt.js"
import passport from "passport";
import CartManager from "../service/cart.manager.js"
import userService from '../dao/models/User.js';
//import cartModel from "../dao/models/Cart.js";
//import CustomError from "../errors/customError.js"
//import EErrors from "../errors/enums.js"
import { generateUserErrorInfo, generateUserExistErrorInfo, generateLoginErrorInfo } from "../errors/info.js"
import { InvalidParamsError, UnauthorizedError, DICTIONARY_ERROR, translate } from "../utils/error.js"
import { logger } from '../utils/logger.js';
import { transport } from "../utils/mailing.js";


const managerUser = new UserManager();

export const loginUser = async (req, res, next) => {
    try {
        passport.authenticate('jwt', { session: false }, async (err, user, info) => {
            try {

                if (err) throw new UnauthorizedError(DICTIONARY_ERROR.INVALID_USER);

                if (!user) {
                    const { email, password } = req.body;
                    console.log("email", email)
                    console.log("password", password)
                    const userBDD = await managerUser.getUserByEmail(email);

                    console.log("usuario", userBDD)

                    if (!userBDD) throw new UnauthorizedError(translate(DICTIONARY_ERROR.USER_NOT_FOUND, email));
                    if (!isValidPassword(password, userBDD.password)) throw new UnauthorizedError(DICTIONARY_ERROR.INVALID_PASSWORD);

                    await managerUser.updateUserLastConnection(userBDD._id);
                    const token = jwt.sign({ user: { id: userBDD._id } }, process.env.JWT_SECRET);
                    res.cookie('jwt', token, { httpOnly: true });
                    return res.status(200).json({ message: "Creedenciales validas", token: token, usercartid: userBDD.cart});
                }
                const token = req.cookies.jwt;
                await managerUser.updateUserLastConnection(user._id);
                jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
                    if (err) throw new InvalidParamsError(DICTIONARY_ERROR.INVALID_TOKEN);                    
                    req.user = user;
                    return res.status(200).json({message: "Creedenciales validas", token: token, usercartid: user.cart});
                })

            } catch (error) {
                next(error);
            }

        })(req, res, next)

    } catch (error) {
        next(error);

    }
}

export const destroySession = (req, res) => {
    if (req.cookies.jwt) {        
        res.clearCookie("jwt");
    }
    res.redirect(`${req.protocol}://${req.get('host')}/`);
}

export const getSession = async (req, res) => {
    const token = req.cookies['jwt']
    const info = jwt.verify(token, process.env.JWT_SECRET);
    const user = await managerUser.getUserById(info.user.id);

    if (user) return res.send({ status: "success", payload: user })
    /*
        try {
            req.session.user ? res.status(200).json(req.session.user) : res.status(404).json({ message: "sesion no encontrada" });
    
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    */
}

export const recoverPassword = async (req, res, next) => {

    const token = req.cookies.jwt;
    const { newpassword } = req.body;

    const userBDD = await managerUser.getUserByEmail(req.user.email)

    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
        if (err) {
            // Token no valido                           
            throw new InvalidParamsError(DICTIONARY_ERROR.INVALID_TOKEN);

        } else {
            // Token valido
            let oldPassword = req.user.password;
            const newHashPassword = createHash(newpassword);

            if (!isValidPassword(newpassword, oldPassword)) {
                userBDD.password = newHashPassword;
                await userBDD.save();

                return res.status(200).send("Contraseña recuperada con exito")
            }
            return res.status(400).send("La contraseña debe ser distinta a la anterior")
        }
    })

}

export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            throw new InvalidParamsError(translate(DICTIONARY_ERROR.INVALID_PARAM, email));
        }
        const userBDD = await managerUser.getUserByEmail(email);

        if (!userBDD) {
            throw new InvalidParamsError(translate(DICTIONARY_ERROR.USER_NOT_FOUND, email));
        } else {
            //Enviar email de recuperacion
            let result = await transport.sendMail({
                from: 'Ecommerce <carolinaeyokoyama@gmail.com>',
                to: email,
                subject: 'Recuperacion de contraseña',
                html: `
                <div> 
                    <p>Puedes recuperar tu contraseña presionando aquí:</p>               
                    <a href="https://localhost:5000/api/session/recover">Recuperar contraseña</a>
                </div>
                `
            });
            const token = jwt.sign({ user: userBDD }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.cookie('jwt', token, { httpOnly: true });
            res.status(201).json({ token, email });
        }
    }
    catch (error) {
        next(error);
    }
}

