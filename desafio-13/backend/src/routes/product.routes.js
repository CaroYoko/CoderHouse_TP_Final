import { Router } from "express";
import ProductController from '../controllers/product.controller.js';
import multer from 'multer';
import { passportError, current } from "../utils/errorMessages.js";

const routerProduct = Router();
const productController = new ProductController();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/img')
    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`)
    }
});
const upload = multer({ storage: storage });

routerProduct.get('/', productController.getProducts.bind(productController));
routerProduct.get('/:id', productController.getProductById.bind(productController));
routerProduct.post('/', passportError('jwt'), current(['Admin', 'Premium']), upload.array('thumbnail'), productController.addProduct.bind(productController));
routerProduct.delete('/:id', passportError('jwt'), current(['Admin', 'Premium']), productController.deleteProduct.bind(productController));
routerProduct.put('/:id', passportError('jwt'), current(['Admin', 'Premium']), upload.array('thumbnail'), productController.updateProduct.bind(productController));

export default routerProduct;