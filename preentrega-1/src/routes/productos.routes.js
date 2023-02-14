import { Router } from "express";
import ProductManager from "../controllers/ProductManager.js";
import multer from 'multer';

const routerProduct = Router();
const productManager = new ProductManager('src/../productos.json');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/img')
    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`)
    }
});

const upload = multer({ storage: storage });

routerProduct.get('/', async (req, res) => {
    try {
        const { limit } = req.query;
        console.log(limit);
        const productos = await productManager.getProducts();
        res.send(JSON.stringify(productos));
    } catch (e) {
        res.status(500).json({ message: e.message, stack: e.stack });
    }
})

routerProduct.get('/:id', async (req, res) => {
    try {
        const producto = await productManager.getProductById(req.params.id);
        res.send(JSON.stringify(producto));
    } catch (e) {
        res.status(500).json({ message: e.message, stack: e.stack });
    }
})

routerProduct.post('/', upload.array('thumbnail'), async (req, res) => {
    try{
        const thumbnail = req.files.map((fileData) => { return fileData.originalname });
        let mensaje = await productManager.addProduct({ ...req.body, thumbnail });
        res.send(mensaje);
    } catch (e) {
        res.status(500).json({ message: e.message, stack: e.stack });
    }
})

routerProduct.delete('/:id', async (req, res) => {
    try {
        let mensaje = await productManager.deleteProduct(req.params.id);
        res.send(mensaje);
    } catch (e) {
        res.status(500).json({ message: e.message, stack: e.stack });
    }
})

routerProduct.put('/:id', upload.array('thumbnail'), async (req, res) => {
    try{
        const thumbnail = req.files.map((fileData) => { return fileData.originalname });
        let mensaje = await productManager.updateProduct(req.params.id, { ...req.body, thumbnail });
        res.send(mensaje);
    } catch (e) {
        res.status(500).json({ message: e.message, stack: e.stack });
    }
})

export default routerProduct