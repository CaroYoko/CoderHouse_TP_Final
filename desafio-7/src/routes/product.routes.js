import { Router } from "express";
import ProductController from '../controllers/product.controller.js';
import multer from 'multer';

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
routerProduct.post('/', upload.array('thumbnail'), productController.addProduct.bind(productController));
routerProduct.delete('/:id', productController.deleteProduct.bind(productController));
routerProduct.put('/:id', upload.array('thumbnail'), productController.updateProduct.bind(productController));

export default routerProduct;