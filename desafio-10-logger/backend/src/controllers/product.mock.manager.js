import productMockModel from '../dao/models/ProductMock.js';

class ProductMockManager {

  constructor() {
    this.model = productMockModel;
  }

  existProduct(productos, producto) {
    const prod = productos.find(x => x.code == producto.code);
    return prod ? true : false;
  };

  async addProducts(products) {
    await this.model.collection.insertMany(products);
    return products;
  }

  async addProduct(nuevoProducto) {

    let productos = [];

    productos = await this.getProducts();

    if (this.existProduct(productos.docs, nuevoProducto)) {
      throw new Error(`${nuevoProducto.code} already exists`);
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

export default ProductMockManager;

