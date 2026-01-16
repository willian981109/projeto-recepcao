require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

// rotas de API
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
  res.sendFile(path.join(__dirname, "../frontend/login.html"));
});

// ADMIN
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/admin.html"));
});

// CONTADOR
app.get("/contador", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/contador.html"));
});

// EXCEDENTES
app.get("/excedentes", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/excedentes.html"));
});

// CHECK-IN → seleção de evento
app.get("/checkin", (req, res) => {
  res.sendFile(path.join(__dirname, "../checkin/selecionar-evento.html"));
});

// CHECK-IN → tela principal (após escolher evento)
app.get("/checkin/entrada", (req, res) => {
  res.sendFile(path.join(__dirname, "../checkin/index.html"));
});


// =======================
// ARQUIVOS ESTÁTICOS (JS / CSS)
// =======================

// frontend (login, admin, contador, excedentes)
app.use(express.static(path.join(__dirname, "../frontend")));

// checkin (script.js, style.css)
app.use("/checkin", express.static(path.join(__dirname, "../checkin")));

// =======================
// FALLBACK (opcional)
// =======================
app.use((req, res) => {
  res.status(404).send("Página não encontrada");
});

module.exports = app;

