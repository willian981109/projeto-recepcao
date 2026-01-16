const API_URL = "http://localhost:3000";

const token = localStorage.getItem("token");
const eventoId = localStorage.getItem("evento_id");
const eventoName = localStorage.getItem("evento_name");


if (!token || !eventoId) {
  alert("Sessão inválida. Faça login novamente.");
  window.location.href = "login.html";
}

async function carregarControleEntradas() {
  try {
    const res = await fetch(`${API_URL}/events/${eventoId}/entradas`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error("Erro ao carregar controle de entradas");
    }

    const data = await res.json();

    // Info do evento
    document.getElementById("eventoNome").textContent =
    `Evento: ${eventoName}`;

    document.getElementById("capacidade").textContent =
      `Capacidade: ${data.event.capacity}`;

    document.getElementById("totalPresentes").textContent =
      `Total de entradas: ${data.event.total}`;

    // Listas
    const listaEntradas = document.getElementById("listaEntradas");
    const listaFora = document.getElementById("listaFora");

    listaEntradas.innerHTML = "";
    listaFora.innerHTML = "";

    // Entradas da lista
    data.entradas_lista.forEach(nome => {
      const li = document.createElement("li");
      li.textContent = nome;
      listaEntradas.appendChild(li);
    });

    // Entradas fora da lista
    data.entradas_fora_lista.forEach(nome => {
      const li = document.createElement("li");
      li.textContent = nome;
      li.classList.add("fora");
      listaFora.appendChild(li);
    });

  } catch (err) {
    console.error(err);
  }
}

// primeira carga
carregarControleEntradas();

// atualização automática
setInterval(carregarControleEntradas, 5000);
