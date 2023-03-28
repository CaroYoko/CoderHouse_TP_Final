import UserManager from "./user.manager.js"
import { validatePassword } from "../utils/bcrypt.js"

const managerUser = new UserManager();

export const testLogin = async (req, res) => {
    //Consultar datos del formulario de login
    const { email, password } = req.body;

    try {
        const user = await managerUser.getUserByEmail(email)

        if (email == user.email && validatePassword(password, user.password)) {

            req.session.login = true;
            req.session.user = user;

            res.status(200).json({                
                message: "Usuario logueado correctamente"
            });

        } else {
            res.status(401).json({
                message: "Usuario o contraseña no validos"
            });
        }

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

export const destroySession = (req, res) => {
    if (req.session.login) {
        req.session.destroy()
    }   
    res.redirect(`${req.protocol}://${req.get('host') }/`);
}