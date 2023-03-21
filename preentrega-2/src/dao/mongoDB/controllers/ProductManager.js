
import { promises as fs } from 'fs';
import productModel from '../models/Product.js';

class ProductManager {

  constructor() {
    this.model = productModel;
  }

  existProduct(productos, producto) {
    const prod = productos.find(x => x.code == producto.code);
    return prod ? true : false;
  };

  async addProduct(nuevoProducto) {

    let productos = [];

    productos = await this.getProducts();

    if (this.existProduct(productos, nuevoProducto)) {
      throw new Error(`${nuevoProducto.code} already exists`);
    };

    let producto = new this.model(nuevoProducto);

    await this.model.collection.insertOne(producto);

    return producto;
  }

  async getProducts({ limit, page, sort, query }) {
    limit = !limit ? 10 : limit;
    page = !page ? 1 : page;
    sort = !sort ? 1 : sort;
    
    return await this.model.paginate(query, { limit, page, sort: { price: sort }});
  }

  async getProductById(id) {
    return await this.model.findById(id).exec();
  }

  async updateProduct(id, info) {
    return await this.model.findByIdAndUpdate(id, info, { 'new': true }).exec();
  }

  async deleteProduct(id) {
    return await this.model.findByIdAndDelete(id).exec();
  }
}

export default ProductManager;

