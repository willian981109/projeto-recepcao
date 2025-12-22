const db = require("../database/connection");

function eventReportService(eventId, callback) {
  // Buscar dados do evento
  db.get(
    "SELECT id, max_capacity FROM events WHERE id = ?",
    [eventId],
    (err, event) => {
      if (err) return callback(err);
      if (!event) return callback({ message: "Evento não encontrado" });

      // Contar total presentes
      db.get(
        `
        SELECT 
          COUNT(*) as total_presentes,
          SUM(CASE WHEN is_extra = 1 THEN 1 ELSE 0 END) as excedentes
        FROM guests
        WHERE event_id = ?
          AND checked_in = 1
        `,
        [eventId],
        (err, result) => {
          if (err) return callback(err);

          callback(null, {
            event_id: event.id,
            max_capacity: event.max_capacity,
            total_presentes: result.total_presentes || 0,
            excedentes: result.excedentes || 0
          });
        }
      );
    }
  );
}

module.exports = { eventReportService };
