const form = document.getElementById("checkinForm");
const message = document.getElementById("message");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const eventId = document.getElementById("event").value;
  const name = document.getElementById("name").value.trim();
  const companion = document.getElementById("companion").checked;

  if (!eventId) {
    message.style.color = "red";
    message.innerText = "Selecione um evento";
    return;
  }

  if (!name) {
    message.style.color = "red";
    message.innerText = "Informe o nome do convidado";
    return;
  }

  // Simulação (depois vira POST /checkin)
  message.style.color = "#22c55e";
  message.innerText =
    `Check-in confirmado!\n` +
    `Evento: ${eventId}\n` +
    `Convidado: ${name}` +
    (companion ? " + acompanhante" : "");

  form.reset();
});
