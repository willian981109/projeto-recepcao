const express = require("express");
const router = express.Router();

const {
  listGuests,
  createGuest,
  checkinGuest
} = require("../controllers/guests.controller");

// Listar convidados de um evento
router.get("/events/:eventId/guests", listGuests);

// Criar convidado para um evento
router.post("/events/:eventId/guests", createGuest);

// Check-in do convidado
router.post("/:id/checkin", checkinGuest);

module.exports = router;


