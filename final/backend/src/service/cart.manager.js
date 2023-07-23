import { promises as fs } from 'fs';
import cartModel from '../dao/models/Cart.js';
import ProductManager from "./product.manager.js";
import TicketManager from "./ticket.manager.js";

class CartManager {

  constructor() {
    this.model = cartModel;
  };

  async addCart(nuevoCarrito) {
    let carrito = new this.model(nuevoCarrito);
    await this.model.collection.insertOne(carrito);
    return carrito;
  }

  async getCarts() {
    return await this.model.find().exec();
  };

  async getCartById(id) {
    return await this.model.findById(id).populate('products.product').exec();
  };

  async addProductIntoCart(idCarrito, idProducto, user) {
    let productManager = new ProductManager();
    let carrito = await this.getCartById(idCarrito);
    let product = await productManager.getProductById(idProducto);

    if (!carrito.products) { carrito.products = []; }

    let productoEnCarrito = carrito.products.find(({ product }) => product._id.equals(idProducto));

    console.log("productoEnCarrito", productoEnCarrito)
    console.log("carrito", carrito)

    if (user.rol === "Premium" && user.email === product.owner) throw new Error("Usuario Premium no puede agregar al carrito su propio producto");

    if (productoEnCarrito) {
      productoEnCarrito.quantity++;
    } else {
      if (!product) { throw new Error("El producto no existe") }
      carrito.products.push({ product: idProducto, quantity: 1 });
    }
    return carrito.save().then(t => t.populate('products.product'))
  };

  async deleteProductIntoCart(idCarrito, idProducto) {
    let carrito = await this.getCartById(idCarrito);
    if (!carrito.products) { carrito.products = []; }
    let productoEnCarrito = carrito.products.find(({ product }) => product._id.equals(idProducto));
    if (!productoEnCarrito) { throw new Error("El producto no existe o no esta en el carrito") }
    if (productoEnCarrito && productoEnCarrito.quantity > 1) {
      productoEnCarrito.quantity--;
    } else if (productoEnCarrito.quantity == 1) {
      const products = carrito.products.find(({ product }) => !product._id.equals(idProducto));
      carrito.products = products;
    }
    return await carrito.save();
  };

  async deleteProductsList(productList, cid) {
    const productIdList = productList.map(({ product }) => product._id);
    return this.model.updateOne({ _id: cid },
      {
        "$pull": {
          "products": { "product": { $in: productIdList } }
        }
      }).exec();
  }

  async updateProductsIntoCart(idCarrito, products) {

    let carrito = await this.getCartById(idCarrito);
    if (!carrito.products) { carrito.products = []; }
    carrito.products = products;
    return await carrito.save();
  }

  async updateQuantityProductIntoCart(idCarrito, idProducto, cantidad) {

    let carrito = await this.getCartById(idCarrito);
    if (!carrito.products) { carrito.products = []; }
    let productoEnCarrito = carrito.products.find(({ product }) => product._id.equals(idProducto));
    if (!productoEnCarrito) { throw new Error("El producto no existe o no esta en el carrito") }
    productoEnCarrito.quantity = cantidad;
    return await carrito.save();
  }

  async deleteAllProductsIntoCart(idCarrito) {
    let carrito = await this.getCartById(idCarrito);
    if (!carrito) { throw new Error("El carrito no existe") }
    if (!carrito.products) { carrito.products = []; }
    carrito.products = [];
    return await carrito.save();
  }

  async finalizePurchase(idCarrito, user) {
    let carrito = await this.getCartById(idCarrito);

    if (!carrito) { throw new Error("El carrito no existe") }
    let productManager = new ProductManager();
    let ticket = new TicketManager();
    if (!carrito.products) { carrito.products = []; }

    const productosConStock = carrito.products.filter(x => x.product.stock >= x.quantity);
    const productosSinStock = carrito.products.filter(x => x.product.stock < x.quantity);
    for (const x of productosConStock) {
      await productManager.updateProduct(x.product._id, user, { stock: (x.product.stock - x.quantity) })
    }

    await this.deleteProductsList(productosConStock, idCarrito);

    const ticketGenerated = await ticket.createTicket(productosConStock, user.email);

    return { ticketGenerated, productosSinStock };
  }

}

export default CartManager;

