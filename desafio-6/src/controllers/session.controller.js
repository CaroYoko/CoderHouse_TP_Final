import UserManager from "./user.manager.js"
import { isValidPassport } from "../utils/bcrypt.js"

const managerUser = new UserManager();

export const testLogin = async (req, res) => {    
    try {
    
        if (!req.user) {
            return res.status(401).send({ status: "error", error: "Invalidate User" })
        }
        //Genero la session de mi usuario
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email
        }

        res.status(200).send({ status: "success", payload: req.user })


    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

export const destroySession = (req, res) => {
    if (req.session.user) {
        req.session.destroy()
    }   
    res.redirect(`${req.protocol}://${req.get('host') }/`);
}