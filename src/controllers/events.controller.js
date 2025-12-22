const db = require("../database/connection");
const { eventReportService } = require("../services/report.service");


// LISTAR EVENTOS
function listEvents(req, res) {
  const query = `
    SELECT * FROM events
    ORDER BY created_at DESC
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(rows);
  });
}

// CRIAR EVENTO
function createEvent(req, res) {
  const { name, event_date, max_capacity } = req.body;

  if (!name || !event_date || !max_capacity) {
    return res.status(400).json({
      error: "Nome, data e capacidade são obrigatórios"
    });
  }

  const query = `
    INSERT INTO events (name, event_date, max_capacity)
    VALUES (?, ?, ?)
  `;

  db.run(query, [name, event_date, max_capacity], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.status(201).json({
      message: "Evento criado com sucesso",
      event_id: this.lastID
    });
  });
}

function eventReport(req, res) {
  const { id } = req.params;

  eventReportService(id, (err, report) => {
    if (err) {
      return res.status(400).json({ error: err.message || err });
    }

    res.json(report);
  });
}

module.exports = {
  listEvents,
  createEvent,
  eventReport
};

