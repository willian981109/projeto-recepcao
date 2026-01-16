const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/frontend/login.html";
}

const btnExcedentes = document.getElementById("btnExcedentes");
const eventSelect = document.getElementById("eventSelect");

/* ===============================
   CARREGAR EVENTOS NO SELECT
================================ */
fetch("http://localhost:3000/events", {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
  .then(res => {
    if (res.status === 401) {
      alert("Sessão expirada. Faça login novamente.");
      localStorage.clear();
      window.location.href = "/login";
      return;
    }
    return res.json();
  })
  .then(data => {
    eventSelect.innerHTML = "<option value=''>Selecione um evento</option>";

    data.forEach(evento => {
      const option = document.createElement("option");
      option.value = evento.id;
      option.textContent = `${evento.name} (${evento.event_date})`;
      eventSelect.appendChild(option);
    });
  })
  .catch(err => {
    console.error("Erro ao carregar eventos:", err);
  });

/* ===============================
   🔴 VERIFICAR EXCEDENTES AO SELECIONAR EVENTO
================================ */
eventSelect.addEventListener("change", () => {
  const eventId = eventSelect.value;
  btnExcedentes.style.display = "none";

  if (!eventId) return;

  fetch(`http://localhost:3000/events/${eventId}/excedentes`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      if (data.event.excedentes > 0) {
        btnExcedentes.style.display = "inline-block";
      }
    })
    .catch(() => {
      btnExcedentes.style.display = "none";
    });
});

/* ===============================
   IMPORTAR CSV
================================ */
function importar() {
  const fileInput = document.getElementById("file");
  const eventId = eventSelect.value;

  if (!eventId) {
    alert("Selecione um evento");
    return;
  }

  if (!fileInput.files.length) {
    alert("Selecione um arquivo CSV");
    return;
  }

  const formData = new FormData();
  formData.append("file", fileInput.files[0]);

  fetch(`http://localhost:3000/guests/import/${eventId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  })
    .then(res => {
      if (!res.ok) {
        throw new Error("Erro na importação");
      }
      return res.json();
    })
    .then(data => {
      alert(`Importação concluída: ${data.total} convidados`);
      fileInput.value = "";
    })
    .catch(err => {
      console.error(err);
      alert("Erro ao importar CSV");
    });
}

/* ===============================
   CRIAR EVENTO
================================ */
function criarEvento() {
  const name = document.getElementById("eventName").value.trim();
  const event_date = document.getElementById("eventDate").value;
  const max_capacity = document.getElementById("eventCapacity").value;

  if (!name || !event_date || !max_capacity) {
    alert("Preencha todos os campos");
    return;
  }

  fetch("http://localhost:3000/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      name,
      event_date,
      max_capacity
    })
  })
    .then(res => {
      if (!res.ok) {
        throw new Error("Erro ao criar evento");
      }
      return res.json();
    })
    .then(() => {
      alert("Evento criado com sucesso!");
      location.reload();
    })
    .catch(err => {
      console.error(err);
      alert("Erro ao criar evento");
    });
}

/* ===============================
   NAVEGAÇÃO
================================ */
function irParaRecepcao() {
  const eventId = eventSelect.value;

  if (!eventId) {
    alert("Selecione um evento antes de ir para o check-in");
    return;
  }

  localStorage.setItem("eventoAtivo", eventId);
  window.location.href = "/checkin";
}

function abrirExcedentes() {
  const eventId = eventSelect.value;

  if (!eventId) {
    alert("Selecione um evento primeiro.");
    return;
  }

  localStorage.setItem("eventoAtivo", eventId);
  window.open("/excedentes", "_blank");
}

/* ===============================
   EVENTOS DOS BOTÕES
================================ */
document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("btnCriarEvento")
    .addEventListener("click", criarEvento);

  document
    .getElementById("btnImportar")
    .addEventListener("click", importar);

  document
    .getElementById("btnRecepcao")
    .addEventListener("click", irParaRecepcao);

  document
    .getElementById("btnExcedentes")
    .addEventListener("click", abrirExcedentes);
});
