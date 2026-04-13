import db from '../database/connection.js';
import  eventReportService  from '../services/report.service.js';

// ===============================
// LISTAR EVENTOS
// ===============================
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

// ===============================
// CRIAR EVENTO
// ===============================
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
      id: this.lastID
    });
  });
}

// ===============================
// EXCLUIR EVENTO (NOVO)
// ===============================
function deleteEvent(req, res) {
  const { id } = req.params;

  db.run(
    `DELETE FROM events WHERE id = ?`,
    [id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: "Evento não encontrado" });
      }

      res.json({ message: "Evento excluído com sucesso" });
    }
  );
}

// ===============================
// RELATÓRIO (CONTADOR)
// ===============================
function eventReport(req, res) {
  const { id } = req.params;

  eventReportService(id, (err, report) => {
    if (err) {
      return res.status(400).json({ error: err.message || err });
    }
    res.json(report);
  });
}

// ===============================
// CONTROLE DE ENTRADAS
// ===============================
function eventEntradasControle(req, res) {
  const eventId = Number(req.params.id);

  db.get(
    `
    SELECT id, name, max_capacity
    FROM events
    WHERE id = ?
    `,
    [eventId],
    (err, event) => {
      if (err || !event) {
        return res.status(404).json({ error: "Evento não encontrado" });
      }

      db.all(
        `
        SELECT 
          g.name,
          ee.fora_lista
        FROM event_entries ee
        JOIN guests g ON g.id = ee.guest_id
        WHERE ee.event_id = ?
        ORDER BY ee.id
        `,
        [eventId],
        (err, rows) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          const entradasLista = rows
            .filter(r => r.fora_lista === 0)
            .map(r => r.name);

          const entradasForaLista = rows
            .filter(r => r.fora_lista === 1)
            .map(r => r.name);

          res.json({
            event: {
              id: event.id,
              name: event.name,
              capacity: event.max_capacity,
              total: rows.length
            },
            entradas_lista: entradasLista,
            entradas_fora_lista: entradasForaLista
          });
        }
      );
    }
  );
}

// ===============================
// ATUALIZAR EVENTO (EDITAR)
// ===============================
function updateEvent(req, res) {
  const { id } = req.params;
  const { name, event_date, max_capacity } = req.body;

  if (!name || !event_date || !max_capacity) {
    return res.status(400).json({
      error: "Nome, data e capacidade são obrigatórios"
    });
  }

  const query = `
    UPDATE events
    SET name = ?, event_date = ?, max_capacity = ?
    WHERE id = ?
  `;

  db.run(
    query,
    [name, event_date, max_capacity, id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: "Evento não encontrado" });
      }

      res.json({ message: "Evento atualizado com sucesso" });
    }
  );
}

export {
  listEvents,
  createEvent,
  deleteEvent,
  updateEvent,           
  eventReport,
  eventEntradasControle
};

