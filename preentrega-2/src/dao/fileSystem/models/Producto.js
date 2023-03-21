class Producto {

  static lastId = 1;
 
  constructor(title, description, price, thumbnail, code, stock, status, category, id = null) {    
    this.modificarTitle = title;
    this.modificarDescription = description;
    this.modificarPrice = price;
    this.modificarThumbnail = thumbnail;
    this.modificarCode = code;
    this.modificarStock = stock;
    this.modificarStatus = status;
    this.modificarCategory = category;
    if(id == 0 || id != null) {
      this.id = id;
      Producto.lastId = id;
    }
    else {      
      Producto.lastId++;
      this.id = Producto.lastId;
    }
  }

  get obtenerId(){
    return this.id;
  }
  set modificarId(id){
    this.id = id;
  }

  set modificarTitle(title){    
    if(!title) throw new Error("falta title");
    this.title = title;   
  }

  set modificarDescription(description){
    if(!description) throw new Error("falta description");
    this.description = description;
  }

  set modificarPrice(price) {
    if(!price) throw new Error("falta price");
    this.price = price;
  }

  set modificarThumbnail(thumbnail = []) {    
    this.thumbnail = thumbnail;
  }

  set modificarCode(code) {
    if(!code) throw new Error("falta code");
    this.code = code;
  }

  set modificarStock(stock) {
    if(!stock) throw new Error("falta stock");
    this.stock = stock;
  }

  set modificarStatus(status) {
    if(!status) throw new Error("falta status");
    this.status = status;
  }

  set modificarCategory(category) {
    if(!category) throw new Error("falta category");
    this.category = category;
  }

  toString(){    
    const str = `ID: ${this.obtenerId} \n` 
    + `Titulo: ${this.title}\n` 
    + `Descripcion: ${this.description}\n`
    + `Precio: ${this.price}\n`
    + `Thumbnail: ${this.thumbnail}\n`
    + `Stock: ${this.stock}\n`
    + `Status: ${this.status}\n`
    + `Category: ${this.category}\n`;
    return str;
  }
  
}

export default Producto;