import { requireAuth, logout } from "/static/auth.js";

/* ===============================
   AUTH
================================ */
const token = requireAuth();
const user = JSON.parse(sessionStorage.getItem("user"));

if (!user) {
  window.location.href = "/login";
}

/* ===============================
   EVENTO (OBRIGATÓRIO)
================================ */
const eventoId = sessionStorage.getItem("evento_id");
const eventoName = sessionStorage.getItem("evento_name");

if (!eventoId || !eventoName) {
  window.location.href = "/checkin";
}

/* ===============================
   ELEMENTOS
================================ */
const eventoNomeSpan = document.getElementById("eventoNome");
const form = document.getElementById("checkinForm");
const inputNome = document.getElementById("nome");
const suggestionsBox = document.getElementById("suggestions");
const warningBox = document.getElementById("warning");
const warningText = document.getElementById("warningText");
const btnProsseguir = document.getElementById("btnProsseguir");
const totalSpan = document.getElementById("total");
const btnExcedentes = document.getElementById("btnExcedentes");
const btnLogout = document.getElementById("btnLogout");
const statusMsg = document.getElementById("statusMsg");

/* ===============================
   UI INICIAL
================================ */
eventoNomeSpan.innerText = eventoName;

/* ===============================
   LOGOUT
================================ */
btnLogout.addEventListener("click", () => {
  logout();
});

/* ===============================
   ESTADO
================================ */
let convidados = [];
let ultimoNomeTentado = "";

/* ===============================
   CONVIDADOS DO EVENTO
================================ */
fetch(`http://localhost:3000/guests/events/${eventoId}/guests`, {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
  .then(res => res.json())
  .then(data => {
    convidados = data || [];
  });

carregarTotal();

/* ===============================
   AUTOCOMPLETE
================================ */
inputNome.addEventListener("input", () => {
  suggestionsBox.innerHTML = "";
  const texto = inputNome.value.toLowerCase();
  if (!texto) return;

  convidados
    .filter(c => c.name.toLowerCase().includes(texto))
    .slice(0, 6)
    .forEach(c => {
      const div = document.createElement("div");
      div.textContent = c.name;
      div.onclick = () => {
        inputNome.value = c.name;
        suggestionsBox.style.display = "none";
      };
      suggestionsBox.appendChild(div);
    });

  suggestionsBox.style.display = "block";
});

/* ===============================
   STATUS
================================ */
function showStatus(message, type = "success") {
  statusMsg.textContent = message;
  statusMsg.className = `status-msg status-${type}`;
  statusMsg.style.display = "block";

  setTimeout(() => {
    statusMsg.style.display = "none";
  }, 3000);
}

/* ===============================
   CHECK-IN
================================ */
form.addEventListener("submit", e => {
  e.preventDefault();

  ultimoNomeTentado = inputNome.value.trim();
  if (!ultimoNomeTentado) return;

  fetch("http://localhost:3000/guests/checkin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      nome: ultimoNomeTentado,
      evento_id: Number(eventoId)
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.type === "NOT_IN_LIST") {
        warningText.innerText = "⚠️ Nome não está na lista";
        warningBox.style.display = "block";
        btnProsseguir.style.display = "inline-block";
        showStatus("⚠ Convidado fora da lista", "error");
        return;
      }

      resetAviso();
      carregarTotal();
      inputNome.value = "";
      showStatus("✔ Convidado registrado com sucesso");
    });
});

/* ===============================
   FORA DA LISTA
================================ */
btnProsseguir.onclick = () => {
  fetch("http://localhost:3000/guests/checkin/override", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      nome: ultimoNomeTentado,
      evento_id: Number(eventoId)
    })
  }).then(() => {
    resetAviso();
    carregarTotal();
    inputNome.value = "";
    showStatus("✔ Convidado registrado com sucesso");
  });
};

function resetAviso() {
  warningBox.style.display = "none";
  btnProsseguir.style.display = "none";
}

/* ===============================
   TOTAL
================================ */
function carregarTotal() {
  fetch(`http://localhost:3000/events/${eventoId}/entradas`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => {
      if (!res.ok) return;
      return res.json();
    })
    .then(data => {
      totalSpan.innerText = data?.event?.total ?? 0;
    })
    .catch(() => {
      totalSpan.innerText = 0;
    });
}

/* ===============================
   EXCEDENTES
================================ */
btnExcedentes.onclick = () => {
  window.open("/excedentes", "_blank");
};
