import { requireAuth, logout } from "/static/auth.js";

/* ===============================
   AUTH
================================ */
const token = requireAuth();
const user = JSON.parse(sessionStorage.getItem("user"));

if (!user || user.role !== "ADMIN") {
  logout();
}

/* ===============================
   ELEMENTOS
================================ */
const btnCriarEvento = document.querySelector(".btn-create");
const btnRecepcao = document.querySelector(".btn-recepcao");
const btnLogout = document.querySelector(".btn-logout");
const btnEventos = document.querySelector(".events-btn"); // ✅ ADICIONADO

const inputName = document.getElementById("eventNameInput");
const inputDate = document.querySelector("input[type='date']");
const inputCapacity = document.querySelector("input[type='number']");

const csvInput = document.getElementById("csvInput");
const fileButtonText = document.getElementById("fileButtonText");

const formMsg = document.getElementById("formMsg");

/* ===============================
   LOGOUT
================================ */
btnLogout.addEventListener("click", logout);

/* ===============================
   BOTÃO EVENTOS ✅
================================ */
btnEventos.addEventListener("click", () => {
  window.location.href = "/admin/events";
});

/* ===============================
   RECEPÇÃO
================================ */
btnRecepcao.addEventListener("click", () => {
  window.location.href = "/checkin";
});

/* ===============================
   FILE UX
================================ */
csvInput.addEventListener("change", () => {
  fileButtonText.textContent = csvInput.files.length
    ? `📄 ${csvInput.files[0].name}`
    : "Escolher arquivo";
});

/* ===============================
   MENSAGEM INLINE
================================ */
function showMessage(text, type = "success") {
  formMsg.textContent = text;
  formMsg.className = `form-msg ${type}`;
  formMsg.classList.remove("hidden");

  setTimeout(() => {
    formMsg.classList.add("hidden");
  }, 3000);
}

/* ===============================
   CRIAR + IMPORTAR
================================ */
btnCriarEvento.addEventListener("click", async () => {
  const name = inputName.value.trim();
  const event_date = inputDate.value;
  const max_capacity = Number(inputCapacity.value);

  if (!name || !event_date || !max_capacity) {
    showMessage("Preencha todos os campos do evento", "error");
    return;
  }

  try {
    btnCriarEvento.disabled = true;
    btnCriarEvento.textContent = "Criando...";

    /* CRIAR EVENTO */
    const resEvent = await fetch("http://localhost:3000/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name, event_date, max_capacity })
    });

    if (!resEvent.ok) {
      alert("Erro grave ao criar evento");
      return;
    }

    const data = await resEvent.json();
    const eventId = data.id;

    /* IMPORTAR CSV */
    if (csvInput.files.length) {
      const formData = new FormData();
      formData.append("file", csvInput.files[0]);

      const resImport = await fetch(
        `http://localhost:3000/guests/import/${eventId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData
        }
      );

      if (!resImport.ok) {
        alert("Erro grave ao importar convidados");
        return;
      }
    }

    /* SUCESSO */
    showMessage("✔ Evento criado com sucesso");

    // reset form
    inputName.value = "";
    inputDate.value = "";
    inputCapacity.value = "";
    csvInput.value = "";
    fileButtonText.textContent = "Escolher arquivo";

  } catch (err) {
    console.error(err);
    alert("Erro inesperado");
  } finally {
    btnCriarEvento.disabled = false;
    btnCriarEvento.textContent = "Criar evento";
  }
});
