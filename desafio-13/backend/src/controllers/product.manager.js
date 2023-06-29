import productModel from '../dao/models/Product.js';

class ProductManager {

  constructor() {
    this.model = productModel;
  }

  existProduct(productos, producto) {
    const prod = productos.find(x => x.code == producto.code);
    return prod ? true : false;
  };

  async addProduct(nuevoProducto, user) {

    let productos = [];

    productos = await this.getProducts();

    if (this.existProduct(productos.docs, nuevoProducto)) {
      throw new Error(`${nuevoProducto.code} already exists`);
    };

    if (user.rol === "Premium") {
      nuevoProducto.owner = user.email;
    };

    let producto = new this.model(nuevoProducto);

    await this.model.collection.insertOne(producto);

    return producto;
  }

  async getStock(product, cantidad) {
    return product.stock >= cantidad;
  }

  async getProducts({ limit, page, sort, query } = {}) {
    limit = !limit ? 10 : limit;
    page = !page ? 1 : page;
    sort = !sort ? 1 : sort;

    return await this.model.paginate(query, { limit, page, sort: { price: sort } });
  }

  async getProductsByOwner(owner) {
    return await this.model.find({ owner: owner }).exec();
  }

  async getProductById(id) {
    return await this.model.findById(id).exec();
  }

  async updateProduct(id, user, info) {
    let product = await this.getProductById(id);

    if (user.rol === "Premium" && product.owner !== user.email) {
      throw new Error("Usuario no autorizado para modicar el producto");
    }
    return await this.model.findByIdAndUpdate(id, info, { 'new': true }).exec();
  }

  async deleteProduct(id, user) {
    let product = await this.getProductById(id);
    if (user.rol === "Premium" && product.owner !== user.email) {
      throw new Error("Usuario no autorizado para eliminar el producto");
    }
    return await this.model.findByIdAndDelete(id).exec();
  }

}

export default ProductManager;

