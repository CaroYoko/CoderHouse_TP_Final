import { Router } from "express";
import ProductManagerFileSystem from "../dao/fileSystem/controllers/ProductManager.js";
import ProductManager from "../dao/mongoDB/controllers/ProductManager.js";
import multer from 'multer';

const mongoDB = "MongoDB";
const routerProduct = Router();
const productManagerMongoDB = new ProductManager();
const productManagerFilesystem = new ProductManagerFileSystem('src/../productos.json');

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
        let productos;
        productos = process.env.DBSELECTION === mongoDB ?
            await productManagerMongoDB.getProducts() :
            await productManagerFilesystem.getProducts();

        if (!limit) {
            res.send(JSON.stringify(productos));
        } else {
            let copiaProductos = productos.slice(0, limit);
            res.send(JSON.stringify(copiaProductos));
        }

    } catch (e) {
        res.status(500).json({ message: e.message, stack: e.stack });
    }
})

routerProduct.get('/:id', async (req, res) => {
    try {
        let producto;
        producto = process.env.DBSELECTION === mongoDB ?
            await productManagerMongoDB.getProductById(req.params.id) :
            await productManagerFilesystem.getProductById(req.params.id);
        res.send(JSON.stringify(producto));
    } catch (e) {
        res.status(500).json({ message: e.message, stack: e.stack });
    }
})

routerProduct.post('/', upload.array('thumbnail'), async (req, res) => {
    try {
        let mensaje;
        const thumbnail = req.files.map((fileData) => { return fileData.originalname });
        mensaje = process.env.DBSELECTION === mongoDB ?
            await productManagerMongoDB.addProduct({ ...req.body, thumbnail }) :
            await productManagerFilesystem.addProduct({ ...req.body, thumbnail });
        res.send(mensaje);
    } catch (e) {
        res.status(500).json({ message: e.message, stack: e.stack });
    }
})

routerProduct.delete('/:id', async (req, res) => {
    try {
        let mensaje;
        mensaje = process.env.DBSELECTION === mongoDB ?
             await productManagerMongoDB.deleteProduct(req.params.id) :
             await productManagerFilesystem.deleteProduct(req.params.id);
        res.send(mensaje);
    } catch (e) {
        res.status(500).json({ message: e.message, stack: e.stack });
    }
})

routerProduct.put('/:id', upload.array('thumbnail'), async (req, res) => {
    try {
        let mensaje;
        const thumbnail = req.files.map((fileData) => { return fileData.originalname });
        mensaje = process.env.DBSELECTION === mongoDB ?
             await productManagerMongoDB.updateProduct(req.params.id, { ...req.body, thumbnail }) :
             await productManagerFilesystem.updateProduct(req.params.id, { ...req.body, thumbnail });
        res.send(mensaje);
    } catch (e) {
        res.status(500).json({ message: e.message, stack: e.stack });
    }
})

export default routerProduct