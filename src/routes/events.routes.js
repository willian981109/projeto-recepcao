const express = require("express");
const router = express.Router();

const authorize = require("../middlewares/authorize");

const {
  listEvents,
  createEvent,
  eventReport,
  eventEntradasControle
} = require("../controllers/events.controller");

// 🔎 LISTAR EVENTOS
// ADMIN + RECEPÇÃO + CONTADOR
router.get(
  "/",
  authorize(["ADMIN", "RECEPCAO", "CONTADOR"]),
  listEvents
);

// ➕ CRIAR EVENTO
// ADMIN
router.post(
  "/",
  authorize(["ADMIN"]),
  createEvent
);

// 📊 RELATÓRIO (contador)
router.get(
  "/:id/report",
  authorize(["CONTADOR"]),
  eventReport
);

// 📋 CONTROLE DE ENTRADAS (ADMIN + RECEPÇÃO)
router.get(
  "/:id/entradas",
  authorize(["ADMIN", "RECEPCAO"]),
  eventEntradasControle
);


module.exports = router;

