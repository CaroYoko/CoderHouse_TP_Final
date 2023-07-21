import UserManager from "../service/user.manager.js";
import CartManager from "../service/cart.manager.js";
import { createHash } from "../utils/bcrypt.js";
import { logger } from '../utils/logger.js';
import userService from '../dao/models/User.js';
import jwt from "jsonwebtoken";
import { InvalidParamsError, DICTIONARY_ERROR, translate } from "../utils/error.js"

const managerUser = new UserManager();

class UserController {

    async createUser(req, res) {
        const { user } = req

        try {
            res.status(200).json({
                message: { message: "Usuario creado", user }
            })

        } catch (error) {
            res.status(500).json({
                message: error.message
            })
        }
    }

    async getAllUsers(req, res) {
        try {
            let mensaje = await managerUser.getAllUsers();
            res.status(200).json(mensaje);
        } catch (e) {
            res.status(500).json({ message: e.message, stack: e.stack });
        }
    }

    async deleteUsers(req, res) {
        try {
            let mensaje = await managerUser.deleteUsers();
            res.status(200).json(mensaje);
        } catch (e) {
            res.status(500).json({ message: e.message, stack: e.stack });
        }
    }

    async changeRolUser(req, res, next) {

        const userBDD = await managerUser.getUserById(req.params.uid);
        userBDD.rol = userBDD.rol === "User" ? "Premium" : "User";
        userBDD.save();
        res.status(200).json({ rol: userBDD.rol });
    }

    async addDocumentsUser(req, res, next) {
        const userBDD = await managerUser.getUserById(req.params.uid);
        const documents = req.files.map((fileData) => { return fileData.originalname });

        documents.forEach(doc => {
            if (!userBDD.documents.find(({ name }) => name === doc)) {
                userBDD.documents.push({ name: doc, reference: `http://localhost:5000/img/documents/${doc}` })
            }
        });
        userBDD.save();
        res.status(200).json({ documents: userBDD.documents });
    }

    async registerUser(req, res, next) {
        try {
            const { first_name, last_name, email, age, password, rol } = req.body;

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
                    rol,
                    cart: cart._id
                }
                logger.info(`new newUser: ${newUser}`);

                await userService.create(newUser);               
                res.status(201).json({ message: "Usuario creado con éxito" });
            }
        }
        catch (error) {
            next(error);
        }
    }
}

export default UserController;