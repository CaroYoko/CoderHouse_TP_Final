import { Router } from "express";

import routerCart from "./cart.routes.js";
import routerProduct from "./product.routes.js";
import routerSession from "./session.routes.js";
import routerUser from "./user.routes.js";
import routerSocket from "./socket.routes.js";
import routerPassport from "./passport.routes.js";
import routerMocking from "./mocking.routes.js";


const router = Router()

router.use("/", routerSocket);
router.use('/api/products', routerProduct);
router.use('/api/carts', routerCart);
router.use('/api/user', routerUser);
//router.use('/api/passport', routerPassport);
router.use('/api/session', routerSession);
router.use('/api/mockingproducts', routerMocking);

export default router;