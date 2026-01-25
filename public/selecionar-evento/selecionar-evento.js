import { requireAuth, logout } from "/static/auth.js";

console.log("SELECIONAR EVENTO - FLUXO FINAL");

/* ===============================
   AUTH
================================ */
const token = requireAuth();
const user = JSON.parse(sessionStorage.getItem("user"));

if (!user) {
  window.location.href = "/login";
}

/* ===============================
   ELEMENTOS
================================ */
const list = document.getElementById("eventList");
const btnLogout = document.getElementById("btnLogout");

/* ===============================
   LOGOUT
================================ */
btnLogout.addEventListener("click", () => {
  logout();
});

/* ===============================
   CARREGAR EVENTOS
================================ */
fetch("http://localhost:3000/events", {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
  .then(res => {
    if (!res.ok) {
      throw new Error("Erro ao buscar eventos");
    }
    return res.json();
  })
  .then(events => {
    if (!events.length) {
      list.innerHTML = "<p>Nenhum evento encontrado.</p>";
      return;
    }

    list.innerHTML = "";

    events.forEach(event => {
      const div = document.createElement("div");
      div.className = "event";

      div.innerHTML = `
        <strong>${event.name}</strong>
        <span>Data: ${event.event_date}</span>
      `;

      div.addEventListener("click", () => {
        /* ===============================
           EVENTO É CONTEXTO DA ABA
        ================================ */
        sessionStorage.setItem("evento_id", event.id);
        sessionStorage.setItem("evento_name", event.name);

        /* ===============================
           REDIRECIONA PARA CHECK-IN
        ================================ */
        window.location.href = "/checkin/entrada";
      });

      list.appendChild(div);
    });
  })
  .catch(err => {
    console.error(err);
    list.innerHTML = "<p>Erro ao carregar eventos.</p>";
  });
