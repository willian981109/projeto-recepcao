import { requireAuth, logout } from "/static/auth.js";

/* ===============================
   AUTH
================================ */
const token = requireAuth();
const user = JSON.parse(sessionStorage.getItem("user"));
if (!user) logout();

/* ===============================
   EVENTO
================================ */
const eventoId = sessionStorage.getItem("evento_id");
const eventoName = sessionStorage.getItem("evento_name");
if (!eventoId) window.location.href = "/checkin";

/* ===============================
   ELEMENTOS
================================ */
const btnLista = document.getElementById("btnLista");
const btnFora = document.getElementById("btnFora");
const boxLista = document.getElementById("boxLista");
const boxFora = document.getElementById("boxFora");
const btnLogout = document.getElementById("btnLogout");

const searchLista = document.getElementById("searchLista");
const searchFora = document.getElementById("searchFora");

const listaEntradas = document.getElementById("listaEntradas");
const listaFora = document.getElementById("listaFora");

const countLista = document.getElementById("countLista");
const countFora = document.getElementById("countFora");

/* ===============================
   TOGGLE
================================ */
btnLista.onclick = () => {
  boxLista.style.display =
    boxLista.style.display === "block" ? "none" : "block";
};

btnFora.onclick = () => {
  boxFora.style.display =
    boxFora.style.display === "block" ? "none" : "block";
};

/* ===============================
   API
================================ */
const API_URL = "http://localhost:3000";

let entradasLista = [];
let entradasFora = [];

async function carregarControleEntradas() {
  const res = await fetch(`${API_URL}/events/${eventoId}/entradas`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) return;

  const data = await res.json();

  document.getElementById("eventoNome").textContent = eventoName;
  document.getElementById("capacidade").textContent = data.event.capacity;
  document.getElementById("totalPresentes").textContent = data.event.total;

  entradasLista = data.entradas_lista || [];
  entradasFora = data.entradas_fora_lista || [];

  /* ===== CONTADORES NOS BOTÕES ===== */
  countLista.textContent = entradasLista.length;
  countFora.textContent = entradasFora.length;

  renderLista(entradasLista, listaEntradas);
  renderLista(entradasFora, listaFora, true);
}

/* ===============================
   RENDER + FILTRO
================================ */
function renderLista(array, ul, fora = false) {
  ul.innerHTML = "";

  array.forEach(nome => {
    const li = document.createElement("li");
    li.textContent = nome;
    if (fora) li.classList.add("fora");
    ul.appendChild(li);
  });
}

function filtrarLista(input, original, ul, fora = false) {
  const termo = input.value.toLowerCase();

  const filtrados = original.filter(nome =>
    nome.toLowerCase().includes(termo)
  );

  renderLista(filtrados, ul, fora);
}

/* ===============================
   BUSCA
================================ */
searchLista.addEventListener("input", () =>
  filtrarLista(searchLista, entradasLista, listaEntradas)
);

searchFora.addEventListener("input", () =>
  filtrarLista(searchFora, entradasFora, listaFora, true)
);

/* ===============================
   INIT
================================ */
carregarControleEntradas();
setInterval(carregarControleEntradas, 5000);

/* ===============================
   LOGOUT
================================ */
btnLogout.onclick = () => logout();
