import { Router } from "express";

import routerCart from "./cart.routes.js";
import routerProduct from "./product.routes.js";
import routerSession from "./session.routes.js";
import routerUser from "./user.routes.js";
import routerSocket from "./socket.routes.js";


const router = Router()

router.use("/", routerSocket);
router.use('/api/products', routerProduct);
router.use('/api/carts', routerCart);
router.use('/api/user', routerUser);
router.use('/api/session', routerSession);

export default router;