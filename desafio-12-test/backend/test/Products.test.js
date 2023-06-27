import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest('http://localhost:5000');

describe("Testing de la ruta de productos", () => {

  let idProduct = "";
  let cookie = {};
 
  before(async function () {
    const userInfo = {
      email: 'carolina.yokoyama@gmail.com',
      password: '123456'
    };
    const result = await requester.post('/api/session/login').send(userInfo);
    const cookieResult = result.headers['set-cookie'][0];
    const cookieInfo = {
      name: cookieResult.split("=")[0],
      value: cookieResult.split("=")[1]
    }
    cookie.name = cookieInfo.name;
    cookie.value = cookieInfo.value?.split(';').shift(); 
  });

  //POST  
  it("Ruta: /api/products con el metodo POST", async function () {
    
    //_body, StatusCode, Ok(true o false)
    const newProduct = {
      title: 'Test producto',
      description: 'Test producto',
      code: 'test',
      price: 1234,
      stock: 10,
      category: 'Test producto'
    }
  
    const result = await requester.post('/api/products')
              .set('Cookie', [`${cookie.name}=${cookie.value}`])
              .field('title', newProduct.title)
              .field('description', newProduct.description)
              .field('code', newProduct.code)
              .field('price', newProduct.price)
              .field('stock', newProduct.stock)
              .field('category', newProduct.category)

    idProduct = result._body._id; 
    expect(result.statusCode).to.be.equal(200);
    expect(result._body).to.have.property('_id');
    expect(result._body.title).to.be.equal(newProduct.title);
    expect(result._body.description).to.be.equal(newProduct.description);
    expect(result._body.code).to.be.equal(newProduct.code);
    expect(result._body.price).to.be.equal(newProduct.price);
    expect(result._body.stock).to.be.equal(newProduct.stock);
    expect(result._body.category).to.be.equal(newProduct.category);
  }) 
  
  //GET
  it("Ruta: /api/products con el metodo GET", async function () {    
    const result = await requester.get('/api/products');
    const products = result._body.payload;  
    expect(result.statusCode).to.be.equal(200);
    expect(Array.isArray(products)).to.be.ok;
  })
  
  //GET BY ID
  it("Ruta: /api/products/pid con el metodo GET", async function () {
    const result = await requester.get(`/api/products/${idProduct}`);
    expect(result.statusCode).to.be.equal(200);
    expect(result._body._id).to.be.equal(idProduct);   
  })

  //PUT
  it("Ruta: /api/products/pid con el metodo PUT", async function () {
    const updateProduct = {
      title: 'Test producto',
      description: 'Test producto',
      code: 'test',
      price: 1234,
      stock: 100,
      category: 'Test producto'
    }
    const result = await requester.put(`/api/products/${idProduct}`)
                                  .set('Cookie', [`${cookie.name}=${cookie.value}`])
                                  .field('title', updateProduct.title)
                                  .field('description', updateProduct.description)
                                  .field('code', updateProduct.code)
                                  .field('price', updateProduct.price)
                                  .field('stock', updateProduct.stock)
                                  .field('category', updateProduct.category)    
    expect(result.statusCode).to.be.equal(200);
    expect(result._body._id).to.be.equal(idProduct); 
    expect(result._body.title).to.be.equal(updateProduct.title);
    expect(result._body.description).to.be.equal(updateProduct.description);
    expect(result._body.code).to.be.equal(updateProduct.code);
    expect(result._body.price).to.be.equal(updateProduct.price);
    expect(result._body.stock).to.be.equal(updateProduct.stock);
    expect(result._body.category).to.be.equal(updateProduct.category);    
  })

  //DELETE
  it("Ruta: /api/products/pid con el metodo DELETE", async function () {
    const result = await requester.delete(`/api/products/${idProduct}`)
                                  .set('Cookie', [`${cookie.name}=${cookie.value}`])
    expect(result.statusCode).to.be.equal(200);
    expect(result._body._id).to.be.equal(idProduct);    
  })

})