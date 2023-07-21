import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest('http://localhost:5000');

describe("Testing de las rutas de carrito", () => {

  let idProduct = "";
  let cookie = {};
  let cartId = "";

  before(async function () {
    const userInfo = {
      email: "yokoyamacarolina@gmail.com",
      password: "123"
    };
    const result = await requester.post('/api/session/login').send(userInfo);
    const cookieResult = result.headers['set-cookie'][0];
    const cookieInfo = {
      name: cookieResult.split("=")[0],
      value: cookieResult.split("=")[1]
    }
    cookie.name = cookieInfo.name;
    cookie.value = cookieInfo.value?.split(';').shift();
    const { _body } = await requester.get('/api/session/current').set('Cookie', [`${cookie.name}=${cookie.value}`])
    cartId = _body.payload.cart;
  });

  //GET BY ID
  it("Ruta: /api/carts/:cid con el metodo GET", async function () {
    const result = await requester.get(`/api/carts/${cartId}`);
    expect(result.statusCode).to.be.equal(200);
    expect(result._body._id).to.be.equal(cartId);
  })

  //PUT  
  it("Ruta: /api/carts/:cid con el metodo PUT", async function () {
    const products =
    [
      {
        "product": "645814a9cc842fc9d0bed3da",
        "quantity": 7
      },
      {
        "product": "6457f407133a3a342738af47",
        "quantity": 10
      }
    ];
    const result = await requester.put(`/api/carts/${cartId}`).send({products})
    expect(result._body.products[0].product).to.be.equal(products[0].product);
    expect(result._body.products[0].quantity).to.be.equal(products[0].quantity);
    expect(result._body.products[1].product).to.be.equal(products[1].product);
    expect(result._body.products[1].quantity).to.be.equal(products[1].quantity);
    expect(result.statusCode).to.be.equal(200);
    expect(result._body._id).to.be.equal(cartId);
  })

  //DELETE  
  it("Ruta: /api/carts/:cid con el metodo DELETE", async function () {    
    const result = await requester.delete(`/api/carts/${cartId}`)
    expect(result.statusCode).to.be.equal(200);
    expect(result._body._id).to.be.equal(cartId);
    expect(result._body.products).to.be.deep.equal([]);    
  })
})