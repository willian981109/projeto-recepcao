console.log("LOGIN.JS CARREGADO");

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
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        message.textContent = data.error;
        message.style.color = "red";
        return;
      }

      // 🔐 salvar token e usuário
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      message.textContent = "Login realizado com sucesso!";
      message.style.color = "green";

      // 🔁 REDIRECIONAMENTO CORRETO (POR ROTAS)
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
          message.textContent = "Perfil de usuário não reconhecido";
          message.style.color = "red";
      }
    })
    .catch(err => {
      console.error(err);
      message.textContent = "Erro ao conectar com o servidor";
      message.style.color = "red";
    });
}
