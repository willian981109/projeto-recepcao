const API_URL = "http://localhost:3000";
const container = document.getElementById("eventsContainer");

// 🔐 Token salvo no login
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

// ===============================
// SEGURANÇA BÁSICA
// ===============================
if (!token || !user) {
  container.innerHTML = "<p>Sessão expirada. Faça login novamente.</p>";
  window.location.href = "/frontend/login.html";
}

// Apenas CONTADOR (ou ADMIN, se quiser permitir)
if (user.role !== "CONTADOR" && user.role !== "ADMIN") {
  container.innerHTML = "<p>Acesso não autorizado.</p>";
  window.location.href = "/frontend/login.html";
}

// ===============================
// CARREGAR PAINEL DO CONTADOR
// ===============================
async function carregarContador() {
  try {
    // Buscar eventos
    const responseEvents = await fetch(`${API_URL}/events`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!responseEvents.ok) {
      throw new Error("Não autorizado para listar eventos");
    }

    const events = await responseEvents.json();

    if (!Array.isArray(events) || events.length === 0) {
      container.innerHTML = "<p>Nenhum evento encontrado.</p>";
      return;
    }

    container.innerHTML = "";

    // Para cada evento, buscar o total
    for (const event of events) {
      const responseTotal = await fetch(
        `${API_URL}/guests/events/${event.id}/total`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!responseTotal.ok) {
        throw new Error("Erro ao buscar total do evento");
      }

      const totalData = await responseTotal.json();
      const total = totalData?.total ?? 0;

      const card = document.createElement("div");
      card.className = "event-card";

      card.innerHTML = `
        <h2>🎉 ${event.name}</h2>
        <p>Pessoas presentes:</p>
        <div class="total">${total}</div>
      `;

      container.appendChild(card);
    }

  } catch (error) {
    console.error(error);
    container.innerHTML = "<p>Erro ao carregar o painel do contador.</p>";
  }
}

// ===============================
// INICIALIZAÇÃO + AUTO-REFRESH
// ===============================
carregarContador();

// Atualiza a cada 5 segundos
const intervalId = setInterval(carregarContador, 5000);

// (Opcional) limpar intervalo ao sair da página
window.addEventListener("beforeunload", () => {
  clearInterval(intervalId);
});
