import { requireAuth, logout } from "/static/auth.js";

/* ===============================
   AUTH
================================ */
const token = requireAuth();
const user = JSON.parse(sessionStorage.getItem("user"));
if (!user || user.role !== "ADMIN") logout();

/* ===============================
   ELEMENTOS
================================ */
const container = document.getElementById("eventsAccordion");
const btnVoltar = document.querySelector(".btn-voltar");

/* ===============================
   VOLTAR
================================ */
btnVoltar.addEventListener("click", () => {
  window.location.href = "/admin";
});

/* ===============================
   BUSCAR EVENTOS
================================ */
async function carregarEventos() {
  try {
    const res = await fetch("http://localhost:3000/events", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const events = await res.json();
    renderizarEventos(events);

  } catch (err) {
    console.error(err);
    container.innerHTML =
      "<p style='color:#ff9800'>Erro ao carregar eventos</p>";
  }
}

/* ===============================
   RENDERIZAR EVENTOS
================================ */
function renderizarEventos(events) {
  container.innerHTML = "";

  events.forEach(event => {
    const card = document.createElement("div");
    card.className = "event-card";

    card.innerHTML = `
      <div class="event-header">
        <div class="event-info">
          <h2>${event.name}</h2>
          <p>📅 ${event.event_date}</p>
        </div>
        <div class="event-capacity">👥 ${event.max_capacity}</div>
      </div>

      <div class="event-details">
        <label>
          Nome
          <input class="edit-name" value="${event.name}">
        </label>

        <label>
          Data
          <input type="date" class="edit-date" value="${event.event_date}">
        </label>

        <label>
          Capacidade total
          <input type="number" class="edit-capacity" value="${event.max_capacity}">
        </label>

        <div class="actions">
          <button class="btn-save">Salvar</button>
          <button class="btn-delete">Excluir</button>
        </div>

        <button class="btn-guests">👥 Ver convidados</button>

        <div class="guests-list hidden">
          <p class="guests-loading">Carregando convidados...</p>
        </div>

        <p class="msg"></p>
      </div>
    `;

    /* ===============================
       TOGGLE EVENTO (accordion)
    ================================ */
    card.querySelector(".event-header").addEventListener("click", () => {
      document.querySelectorAll(".event-card").forEach(c => {
        if (c !== card) c.classList.remove("open");
      });
      card.classList.toggle("open");
    });

    /* ===============================
       SALVAR EVENTO
    ================================ */
    card.querySelector(".btn-save").addEventListener("click", async e => {
      e.stopPropagation();

      const body = {
        name: card.querySelector(".edit-name").value.trim(),
        event_date: card.querySelector(".edit-date").value,
        max_capacity: Number(card.querySelector(".edit-capacity").value)
      };

      await fetch(`http://localhost:3000/events/${event.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      card.querySelector(".msg").textContent = "✔ Evento atualizado";
    });

    /* ===============================
       EXCLUIR EVENTO
    ================================ */
    card.querySelector(".btn-delete").addEventListener("click", async e => {
      e.stopPropagation();
      if (!confirm("Deseja excluir este evento?")) return;

      await fetch(`http://localhost:3000/events/${event.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      card.remove();
    });

    /* ===============================
       LISTAR CONVIDADOS
    ================================ */
    const btnGuests = card.querySelector(".btn-guests");
    const guestsList = card.querySelector(".guests-list");
    let guestsLoaded = false;

    btnGuests.addEventListener("click", async e => {
      e.stopPropagation();

      const isOpen = !guestsList.classList.contains("hidden");
      guestsList.classList.toggle("hidden");

      btnGuests.textContent = isOpen
        ? "👥 Ver convidados"
        : "👥 Ocultar convidados";

      if (guestsLoaded || isOpen) return;

      try {
        const res = await fetch(
          `http://localhost:3000/guests/events/${event.id}/guests`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const guests = await res.json();

        guestsList.innerHTML = "";

        if (!guests.length) {
          guestsList.innerHTML =
            "<p style='color:#aaa'>Nenhum convidado cadastrado</p>";
        } else {
          guests.forEach(g => {
            const item = document.createElement("div");
            item.className = "guest-item";
            item.textContent = g.name;
            guestsList.appendChild(item);
          });
        }

        guestsLoaded = true;

      } catch (err) {
        console.error(err);
        guestsList.innerHTML =
          "<p style='color:#ff9800'>Erro ao carregar convidados</p>";
      }
    });

    container.appendChild(card);
  });
}

/* ===============================
   INIT
================================ */
carregarEventos();
