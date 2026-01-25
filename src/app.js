require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

// rotas de API (backend)
const guestsRoutes = require("./routes/guests.routes");
const eventsRoutes = require("./routes/events.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();

// =======================
// MIDDLEWARES
// =======================
app.use(cors());
app.use(express.json());

// =======================
// ARQUIVOS ESTÁTICOS (FRONTEND)
// =======================
app.use("/static", express.static(path.join(__dirname, "../public")));

// =======================
// ROTAS DE API (BACKEND)
// =======================
app.use("/guests", guestsRoutes);
app.use("/events", eventsRoutes);
app.use("/auth", authRoutes);

// =======================
// ROTAS DE PÁGINAS (FRONTEND)
// =======================

// LOGIN
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/login/login.html"));
});

// ADMIN (criar evento)
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/admin/admin.html"));
});

// ADMIN → EVENTOS (NOVO)
app.get("/admin/events", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../public/admin/events/events.html")
  );
});

// CONTADOR
app.get("/contador", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/contador/contador.html"));
});

// EXCEDENTES
app.get("/excedentes", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/excedentes/excedentes.html"));
});

// CHECK-IN → seleção de evento
app.get("/checkin", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "../public/selecionar-evento/selecionar-evento.html"
    )
  );
});

// CHECK-IN → tela principal
app.get("/checkin/entrada", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/checkin/index.html"));
});

// =======================
// FALLBACK
// =======================
app.use((req, res) => {
  res.status(404).send("Página não encontrada");
});

module.exports = app;
