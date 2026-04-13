import express from 'express';
const router = express.Router();

import authorize from '../middlewares/authorize.js';

import {
  listEvents,
  createEvent,
  eventReport,
  eventEntradasControle,
  deleteEvent,
  updateEvent         
} from '../controllers/events.controller.js';

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

export default router;
