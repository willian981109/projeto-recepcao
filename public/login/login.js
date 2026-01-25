import { saveToken, saveUser } from "/static/auth.js";

console.log("LOGIN.JS CARREGADO");

const btnLogin = document.getElementById("btnLogin");
btnLogin.addEventListener("click", login);

function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const message = document.getElementById("message");

  message.textContent = "Carregando...";
  message.style.color = "black";

  fetch("http://localhost:3000/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  })
    .then(res => {
      if (!res.ok) throw new Error("Falha no login");
      return res.json();
    })
    .then(data => {
      if (data.error) {
        message.textContent = data.error;
        message.style.color = "red";
        return;
      }

      /* ===============================
         LIMPA SESSÃO ANTIGA
      ================================ */
      sessionStorage.clear();

      /* ===============================
         SALVA AUTENTICAÇÃO
      ================================ */
      saveToken(data.token);
      saveUser(data.user);

      message.textContent = "Login realizado com sucesso!";
      message.style.color = "green";

      /* ===============================
         REDIRECIONAMENTO
      ================================ */
      switch (data.user.role) {
        case "ADMIN":
          window.location.href = "/admin";
          break;

        case "RECEPCAO":
          window.location.href = "/checkin";
          break;

        case "CONTADOR":
          window.location.href = "/contador";
          break;

        default:
          message.textContent = "Perfil não reconhecido";
          message.style.color = "red";
      }
    })
    .catch(err => {
      console.error(err);
      message.textContent = "Usuário ou senha inválidos";
      message.style.color = "red";
    });
}
