const db = require("../database/connection");

// LISTAR CONVIDADOS POR EVENTO
function listGuests(req, res) {
  const { eventId } = req.params;

  const query = `
    SELECT * FROM guests
    WHERE event_id = ?
    ORDER BY created_at DESC
  `;

  db.all(query, [eventId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(rows);
  });
}

// CRIAR CONVIDADO
function createGuest(req, res) {
  const { eventId } = req.params;
  const { name, document, has_companion, children_count } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Nome do convidado é obrigatório" });
  }

  const query = `
    INSERT INTO guests (
      event_id, name, document, has_companion, children_count
    )
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [
      eventId,
      name,
      document || null,
      has_companion || 0,
      children_count || 0
    ],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
        message: "Convidado criado com sucesso",
        guest_id: this.lastID
      });
    }
  );
}

module.exports = {
  listGuests,
  createGuest
};

const { checkinGuestService } = require("../services/checkin.service");

function checkinGuest(req, res) {
  const { id } = req.params;

  checkinGuestService(id, (err, result) => {
    if (err) {
      return res.status(400).json({ error: err.message || err });
    }

    res.json(result);
  });
}

module.exports = {
  listGuests,
  createGuest,
  checkinGuest
};

