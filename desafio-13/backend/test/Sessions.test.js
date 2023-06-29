import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest('http://localhost:5000');

describe("Testing de la ruta de sesiones", () => {
  let cookie = "";
  
  it("Ruta: /api/session/login con el metodo POST -  Caso exitoso", async function () {
      const loginUser = {
          email: "yokoyamacarolina@gmail.com",
          password: "123"
      }

      const result = await requester.post('/api/session/login').send(loginUser);
      const cookieResult = result.headers['set-cookie'][0];

      expect(cookieResult).to.be.ok; //Verificar existencia de cookie
      cookie = {
          name: cookieResult.split("=")[0],
          value: cookieResult.split("=")[1],
      }
      expect(cookie.name).to.be.ok.and.equal('jwt'); //Verificacion de nombre cookie
      expect(cookie.value).to.be.ok; //Verificion de valor correcto
  })

  it("Ruta: /api/session/login con el metodo POST - Caso fallido", async function () {
    const loginUser = {
        email: "yokoyamacarolina@gmail.com",
        password: "failPassword"
    }
    const result = await requester.post('/api/session/login').send(loginUser);
    const cookieResult = result.headers['set-cookie']?.find(cookieString => cookieString.split("=").shift() === "jwt");   
    expect(cookieResult).to.be.undefined;
})

  it("Ruta: /api/session/current con el metodo GET", async function () {
      //.set() setear valores como si tratara de las cookies del navegador
      const { _body } = await requester.get('/api/session/current').set('Cookie', [`${cookie.name}=${cookie.value}`]);
      expect(_body.payload.email).to.be.equal("yokoyamacarolina@gmail.com");
  })
})