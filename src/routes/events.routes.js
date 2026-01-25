const express = require("express");
const router = express.Router();

const authorize = require("../middlewares/authorize");

const {
  listEvents,
  createEvent,
  eventReport,
  eventEntradasControle,
  deleteEvent,
  updateEvent          // ✅ IMPORTADO
} = require("../controllers/events.controller");

// 🔎 LISTAR EVENTOS
router.get(
  "/",
  authorize(["ADMIN", "RECEPCAO", "CONTADOR"]),
  listEvents
);

// ➕ CRIAR EVENTO
router.post(
  "/",
  authorize(["ADMIN"]),
  createEvent
);

// ✏️ EDITAR EVENTO (NOVO)
router.put(
  "/:id",
  authorize(["ADMIN"]),
  updateEvent
);

// 🗑️ EXCLUIR EVENTO
router.delete(
  "/:id",
  authorize(["ADMIN"]),
  deleteEvent
);

// 📊 RELATÓRIO (CONTADOR)
router.get(
  "/:id/report",
  authorize(["CONTADOR"]),
  eventReport
);

// 📋 CONTROLE DE ENTRADAS
router.get(
  "/:id/entradas",
  authorize(["ADMIN", "RECEPCAO", "CONTADOR", "CHECKIN"]),
  eventEntradasControle
);

module.exports = router;
