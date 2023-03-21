class Cart {

  static lastId = 1;
 
  constructor(products = [], id = null) {    
    this.products = products;
    if(id == 0 || id != null) {
      this.id = id;
      Cart.lastId = id;
    }
    else {      
      Cart.lastId++;
      this.id = Cart.lastId;
    }
  }

  get obtenerId(){
    return this.id;
  }
  set modificarId(id){
    this.id = id;
  }

  toString(){    
    const str = `ID: ${this.obtenerId} \n` 
    + `Productos: 
    ${this.products.array.forEach(element => element.toString())} \n`;
    return str;
  }
  
}

export default Cart;