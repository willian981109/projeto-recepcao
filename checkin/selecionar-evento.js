console.log("SELECIONAR-EVENTO.JS CARREGADO");

const token = localStorage.getItem("token");

if (!token) {
  alert("Sessão expirada. Faça login novamente.");
  window.location.href = "/login";
}

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
    const list = document.getElementById("eventList");

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
        localStorage.setItem("evento_id", event.id);
        localStorage.setItem("evento_name", event.name);

        // 🔁 ROTA CORRETA
        window.location.href = "/checkin/entrada";
      });

      list.appendChild(div);
    });
  })
  .catch(err => {
    console.error(err);
    document.getElementById("eventList").innerHTML =
      "<p>Erro ao carregar eventos.</p>";
  });

