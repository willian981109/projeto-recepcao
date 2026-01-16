const token = localStorage.getItem("token");
const eventoId = localStorage.getItem("evento_id");
const eventoName = localStorage.getItem("evento_name");
const user = JSON.parse(localStorage.getItem("user"));

if (!token || !eventoId || !eventoName || !user) {
  alert("Selecione um evento antes de continuar");
  window.location.href = "/checkin/selecionar-evento.html";
}

// ELEMENTOS
const form = document.getElementById("checkinForm");
const inputNome = document.getElementById("nome");
const suggestionsBox = document.getElementById("suggestions");
const warningBox = document.getElementById("warning");
const warningText = document.getElementById("warningText");
const btnProsseguir = document.getElementById("btnProsseguir");
const totalSpan = document.getElementById("total");
const eventoNomeSpan = document.getElementById("eventoNome");
const btnControle = document.getElementById("btnExcedentes"); // botão agora é CONTROLE
const btnTrocarEvento = document.getElementById("btnTrocarEvento");

eventoNomeSpan.innerText = eventoName;

// 🔓 CONTROLE SEMPRE DISPONÍVEL
btnControle.style.display = "inline-block";

let convidados = [];
let ultimoNomeTentado = "";

// ===============================
// CONVIDADOS DO EVENTO (AUTOCOMPLETE)
// ===============================
fetch(`http://localhost:3000/guests/events/${eventoId}/guests`, {
  headers: { Authorization: `Bearer ${token}` }
})
  .then(res => res.json())
  .then(data => convidados = data);

// AUTOCOMPLETE
inputNome.addEventListener("input", () => {
  const texto = inputNome.value.toLowerCase();
  suggestionsBox.innerHTML = "";

  if (!texto) {
    suggestionsBox.style.display = "none";
    return;
  }

  const filtrados = convidados
    .filter(c => c.name.toLowerCase().includes(texto))
    .slice(0, 6);

  filtrados.forEach(c => {
    const div = document.createElement("div");
    div.textContent = c.name;
    div.style.padding = "6px";
    div.style.cursor = "pointer";
    div.onclick = () => {
      inputNome.value = c.name;
      suggestionsBox.style.display = "none";
    };
    suggestionsBox.appendChild(div);
  });

  suggestionsBox.style.display = filtrados.length ? "block" : "none";
});

// ===============================
// CHECK-IN
// ===============================
form.addEventListener("submit", e => {
  e.preventDefault();
  ultimoNomeTentado = inputNome.value.trim();

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
        return;
      }

      resetAviso();
      carregarTotal();
      inputNome.value = "";
    });
});

// ===============================
// CHECK-IN FORA DA LISTA
// ===============================
btnProsseguir.addEventListener("click", () => {
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
  })
    .then(() => {
      resetAviso();
      carregarTotal();
      inputNome.value = "";
    });
});

function resetAviso() {
  warningBox.style.display = "none";
  btnProsseguir.style.display = "none";
}

// ===============================
// TOTAL DE ENTRADAS
// ===============================
function carregarTotal() {
  fetch(`http://localhost:3000/guests/events/${eventoId}/total`, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(data => {
      totalSpan.innerText = data.total ?? 0;
    });
}

// ===============================
// ABRIR CONTROLE DE ENTRADAS
// ===============================
btnControle.onclick = () => {
  window.open("/excedentes", "_blank"); // depois podemos renomear para /controle
};

// PRIMEIRA CARGA
carregarTotal();
