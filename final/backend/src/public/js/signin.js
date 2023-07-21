let email = document.getElementById("inputEmail");
let password = document.getElementById("inputPassword");
let name = document.getElementById("inputNombre");
let lastname = document.getElementById("inputApellido");
let age = document.getElementById("inputEdad");
let botonRegistrarse = document.getElementById("btnRegistrarse");
let botonVolver = document.getElementById("btnVolver");

botonVolver.addEventListener("click", () => {
  window.location.assign(`${window.location.origin}/`);
});

botonRegistrarse.addEventListener("click", () => {
  const data = { 
    first_name: name.value, 
    last_name: lastname.value, 
    email: email.value, 
    password: password.value, 
    age: age.value
  };
  fetch(`${window.location.origin}/api/user`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(function (response) {
      if (response.ok && response.status === 200) {
        window.location.assign(`${window.location.origin}/`);
      }
    });
})