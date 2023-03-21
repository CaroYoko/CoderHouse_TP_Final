import { request, Router } from "express";
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

function updateQueryStringParamValue(uri, key, value) {
    const re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    const separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) return uri.replace(re, '$1' + key + "=" + value + '$2');
    return uri + separator + key + "=" + value;
  }

routerProduct.get('/', async (req, res) => {
    try {
        let { limit, page, sort } = req.query;

        let query = {};
        Object.entries(req.query).forEach(([key, value]) => {
            if (!['sort', 'limit', 'page'].includes(key))
                query[key] = value;
        });

        let productos = process.env.DBSELECTION === mongoDB ?
            await productManagerMongoDB.getProducts({ limit, page, sort, query }) :
            await productManagerFilesystem.getProducts({ limit, page, sort, query });
     
        productos.nextlink = productos.nextPage ?  updateQueryStringParamValue(req.protocol + '://' + req.get('host') + req.originalUrl,"page",productos.nextPage) : "";
        productos.prevlink = productos.prevPage ? updateQueryStringParamValue(req.protocol + '://' + req.get('host') + req.originalUrl,"page",productos.prevPage) : "";

        delete Object.assign(productos, { payload: productos.docs })['docs'];

        res.status(200).json({ ...productos, status: 'success' });

    } catch (e) {
        res.status(500).json({ message: e.message, stack: e.stack, status: 'error' });
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