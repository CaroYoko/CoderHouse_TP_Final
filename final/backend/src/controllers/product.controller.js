import ProductManager from "../service/product.manager.js";

const productManagerMongoDB = new ProductManager();

class ProductController {

    updateQueryStringParamValue(uri, key, value) {
        const re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
        const separator = uri.indexOf('?') !== -1 ? "&" : "?";
        if (uri.match(re)) return uri.replace(re, '$1' + key + "=" + value + '$2');
        return uri + separator + key + "=" + value;
    }

    async getProducts(req, res, next) {
        try {
            let { limit, page, sort } = req.query;

            let query = {};
            Object.entries(req.query).forEach(([key, value]) => {
                if (!['sort', 'limit', 'page'].includes(key))
                    query[key] = value;
            });

            let productos = await productManagerMongoDB.getProducts({ limit, page, sort, query });

            productos.nextlink = productos.nextPage ? this.updateQueryStringParamValue(req.protocol + '://' + req.get('host') + req.originalUrl, "page", productos.nextPage) : "";
            productos.prevlink = productos.prevPage ? this.updateQueryStringParamValue(req.protocol + '://' + req.get('host') + req.originalUrl, "page", productos.prevPage) : "";

            delete Object.assign(productos, { payload: productos.docs })['docs'];

            res.status(200).json({ ...productos, status: 'success' });

        } catch (e) {
            next(e);
            //res.status(500).json({ message: e.message, stack: e.stack, status: 'error' });
        }
    }

    async getProductById(req, res, next) {
        try {
            let producto = await productManagerMongoDB.getProductById(req.params.id);
            res.status(200).json(producto);
        } catch (e) {
            next(e);
            //res.status(500).json({ message: e.message, stack: e.stack });
        }
    }

    async addProduct(req, res, next) {
        try {
            const thumbnail = req.files.map((fileData) => { return fileData.originalname });           
            let mensaje = await productManagerMongoDB.addProduct({ ...req.body, thumbnail }, req.user);  
            res.send(mensaje);
        } catch (e) {
            next(e);
            //res.status(500).json({ message: e.message, stack: e.stack });
        }
    }

    async deleteProduct(req, res, next) {
        try {
            let mensaje = await productManagerMongoDB.deleteProduct(req.params.id, req.user);
            res.send(mensaje);
        } catch (e) {
            next(e);
            //res.status(500).json({ message: e.message, stack: e.stack });
        }
    }

    async updateProduct(req, res, next) {
        try {
            const thumbnail = req.files.map((fileData) => { return fileData.originalname });
            let mensaje = await productManagerMongoDB.updateProduct(req.params.id, req.user, { ...req.body, thumbnail });
            res.send(mensaje);
        } catch (e) {
            next(e);
            //res.status(500).json({ message: e.message, stack: e.stack });
        }
    }
}

export default ProductController;

