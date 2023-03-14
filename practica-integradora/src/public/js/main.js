const socket = io()

const botonChat = document.getElementById("botonChat")
const parrafosMensajes = document.getElementById("parrafosMensajes")
const val = document.getElementById("chatBox")
let user;

fetch('http://localhost:5000/messages')
  .then(response => response.json())
  .then(arrayMensajes => {  
    parrafosMensajes.innerHTML = ""
    arrayMensajes.forEach(message => {
      parrafosMensajes.innerHTML += `<p>${message.user} : ${message.message} </p>`
    });
  });

Swal.fire({
  title: "Identificacion de Usuario",
  text: "Por favor ingrese su nombre de usuario",
  input: "text",
  inputValidator: (valor) => {
    return !valor && 'Ingrese un valor valido'
  },
  allowOutsideClick: false
}).then(resultado => {
  user = resultado.value
  console.log(user)
})

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
