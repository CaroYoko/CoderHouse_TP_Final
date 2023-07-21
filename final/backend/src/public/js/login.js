let email = document.getElementById("inputEmail");
let password = document.getElementById("inputPassword");
let btnRegistrarse = document.getElementById("btnRegistrarse");
let btnIngresar = document.getElementById("btnIngresar");

btnRegistrarse.addEventListener("click", () => {
  window.location.assign(`${window.location.origin}/signin`)
});

btnIngresar.addEventListener("click", () => {
  const data = { email: email.value, password: password.value };
  fetch(`${window.location.origin}/api/session/login`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(function (response) {
      if (response.ok && response.status === 200) {
        window.location.assign(`${window.location.origin}/products`);
      }
    });
})