const socket = io()

const botonAnterior = document.getElementById("btnAnterior");
const botonSiguiente = document.getElementById("btnSiguiente");
const labelPaginas = document.getElementById("label");
const div = document.getElementById("pagina");
let paginaActual = div.getAttribute("numeroPagina");
let paginasTotales = div.getAttribute("paginasTotales");
let paginaSiguiente = parseInt(paginaActual) + 1;
let paginaAnterior = parseInt(paginaActual) - 1;

botonSiguiente.addEventListener("click", () => {
  if(paginaActual == paginasTotales){ return }
  fetch(`${window.location.origin}/api/products?limit=3&page=${paginaSiguiente}`)
    .then(response => response.json())
    .then(arrayProductos => {
      paginaActual = arrayProductos.page;

      const listaProductos = document.getElementById("productList");
      while (listaProductos.firstChild) {
        listaProductos.removeChild(listaProductos.firstChild);
      }
      const productosFiltrado = !arrayProductos.payload ? [] : arrayProductos.payload.map(x => ({ title: x.title, description: x.description, price: x.price, code: x.code, category: x.category, stock: x.stock, thumbnail: x.thumbnail }))

      productosFiltrado.forEach(producto => {
        agregarProducto(producto);
      });

      labelPaginas.innerHTML = `${paginaActual} de ${paginasTotales}`;
    });

})

botonAnterior.addEventListener("click", () => {
  fetch(`${window.location.origin}/api/products?limit=3&page=${paginaAnterior}`)
    .then(response => response.json())
    .then(arrayProductos => {
      paginaActual = arrayProductos.page;
      const listaProductos = document.getElementById("productList");
      while (listaProductos.firstChild) {
        listaProductos.removeChild(listaProductos.firstChild);
      }
      const productosFiltrado = !arrayProductos.payload ? [] : arrayProductos.payload.map(x => ({ title: x.title, description: x.description, price: x.price, code: x.code, category: x.category, stock: x.stock, thumbnail: x.thumbnail }))

      productosFiltrado.forEach(producto => {
        agregarProducto(producto);
      });
      labelPaginas.innerHTML = `${paginaActual} de ${paginasTotales}`;
    });

})

const agregarProducto = (producto) => {
  const listaProductos = document.getElementById("productList");

  let li = document.createElement("li");
  listaProductos.appendChild(li);
  let texto = document.createTextNode(producto.title);
  li.appendChild(texto);
  let ul = document.createElement("ul");
  li.appendChild(ul);

  li = document.createElement("li");
  ul.appendChild(li);
  texto = document.createTextNode(`Descripcion: ${producto.description}`);
  li.appendChild(texto);

  li = document.createElement("li");
  ul.appendChild(li);
  texto = document.createTextNode(`Precio: ${producto.price}`);
  li.appendChild(texto);

  li = document.createElement("li");
  ul.appendChild(li);
  texto = document.createTextNode(`Codigo ${producto.code}`);
  li.appendChild(texto);

  li = document.createElement("li");
  ul.appendChild(li);
  texto = document.createTextNode(`Stock: ${producto.stock}`);
  li.appendChild(texto);

  li = document.createElement("li");
  ul.appendChild(li);
  texto = document.createTextNode(`Categoria: ${producto.category}`);
  li.appendChild(texto);

  li = document.createElement("li");
  ul.appendChild(li);
  texto = document.createTextNode(`Status: ${producto.status}`);
  li.appendChild(texto);

  var button = document.createElement('input');
  button.type = 'button';
  button.value = 'Agregar';
  li.appendChild(button)
  //li.appendChild(button)
}

/*
botonChat.addEventListener("click", () => {

  if (val.value.trim().length > 0) {
    socket.emit("message", { user: user, message: val.value });
    val.value = "";
  }
})

socket.on("allMessages", arrayMensajes => {
  parrafosMensajes.innerHTML = ""
  arrayMensajes.forEach(message => {
    parrafosMensajes.innerHTML += `<p>${message.user} : ${message.message} </p>`
  });
})
*/