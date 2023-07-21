import { Router } from "express";
import UserController from "../controllers/user.controller.js";
import multer from 'multer';

const routerUser = Router();
const userController = new UserController();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/img/documents')
    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`)
    }
});
const upload = multer({ storage: storage });

routerUser.post("/", userController.registerUser.bind(userController));
routerUser.post("/:uid/documents", upload.array('documents'), userController.addDocumentsUser.bind(userController));
routerUser.post("/premium/:uid", userController.changeRolUser.bind(userController));
routerUser.get("/", userController.getAllUsers.bind(userController));
routerUser.delete("/", userController.deleteUsers.bind(userController));

export default routerUser

/*
    a) Usuario se registra correctamente -> Va a login
    b) Usuario se registra con un email existente -> Vuelve a registro con mensaje de error
    c) Usuario intenta loguearse pero datos no validos -> Va a Login va con mensaje
    d) Usuario no esta registrado -> Va al login con mensaje
    e) Usuario inicia sesion y no es admin -> Va a products con rol de user
    f) Usuario inicia sesion y es admin -> Va a products con rol de admin
    g) Usuario se desloguea -> Va a login con mensaje

*/