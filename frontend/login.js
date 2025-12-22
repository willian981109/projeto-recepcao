function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const message = document.getElementById("message");

  message.textContent = "Carregando...";

  fetch("http://localhost:3000/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username,
      password
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        message.textContent = data.error;
        message.style.color = "red";
      } else {
        message.textContent = "Login realizado com sucesso!";
        message.style.color = "green";

        // salvar sessão simples
        localStorage.setItem("user", JSON.stringify(data.user));

        // redirecionar depois
        // window.location.href = "checkin.html";
      }
    })
    .catch(() => {
      message.textContent = "Erro ao conectar com o servidor";
      message.style.color = "red";
    });
}
