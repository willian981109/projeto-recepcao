import { requireAuth, logout } from "/static/auth.js";

/* ===============================
   AUTH
================================ */
const token = requireAuth();
const user = JSON.parse(sessionStorage.getItem("user"));

if (!user || (user.role !== "CONTADOR" && user.role !== "ADMIN")) {
  logout();
}

/* ===============================
   CONFIG
================================ */
const API_URL = "http://localhost:3000";
const container = document.getElementById("eventsContainer");

const lastTotals = {};

/* ===============================
   CARREGAR PAINEL (ROTA CERTA)
================================ */
async function carregarContador() {
  try {
    const resEvents = await fetch(`${API_URL}/events`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!resEvents.ok) {
      logout();
      return;
    }

    const events = await resEvents.json();
    container.innerHTML = "";

    for (const event of events) {
      const res = await fetch(
        `${API_URL}/events/${event.id}/entradas`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!res.ok) continue;

      const data = await res.json();
      const total = data?.event?.total ?? 0;

      const shouldAnimate =
        lastTotals[event.id] !== undefined &&
        lastTotals[event.id] !== total;

      const card = document.createElement("div");
      card.className = "event-card";
      card.innerHTML = `
        <h2>🎉 ${event.name}</h2>
        <p>Pessoas presentes:</p>
        <div class="total ${shouldAnimate ? "animate" : ""}">
          ${total}
        </div>
      `;

      container.appendChild(card);
      lastTotals[event.id] = total;
    }
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Erro ao carregar painel.</p>";
  }
}

/* ===============================
   INIT + AUTO REFRESH
================================ */
carregarContador();
setInterval(carregarContador, 5000);
