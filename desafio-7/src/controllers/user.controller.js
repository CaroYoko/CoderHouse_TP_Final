import UserManager from "./user.manager.js";
import { createHash } from "../utils/bcrypt.js";
import CartManager from "../controllers/cart.manager.js";

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
}

export default UserController;