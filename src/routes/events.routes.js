const express = require("express");
const router = express.Router();

const {
  listEvents,
  createEvent,
  eventReport
} = require("../controllers/events.controller");

router.get("/", listEvents);
router.post("/", createEvent);

// Relatório do evento
router.get("/:id/report", eventReport);

module.exports = router;


