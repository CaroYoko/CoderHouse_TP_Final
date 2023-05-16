import { Router } from "express";

import ProductMockController from '../controllers/product.mock.controller.js';

const routerMocking = Router();
const productMockController = new ProductMockController();

routerMocking.get('/', productMockController.getMockProducts.bind(productMockController))
//routerMocking.post('/', passportError('jwt'), current(['Admin']), upload.array('thumbnail'), productMockController.addProduct.bind(productMockController));

export default routerMocking

