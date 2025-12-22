const db = require("../database/connection");

function checkinGuestService(guestId, callback) {
  // 1. Buscar convidado
  db.get(
    "SELECT * FROM guests WHERE id = ?",
    [guestId],
    (err, guest) => {
      if (err) return callback(err);
      if (!guest) return callback({ message: "Convidado não encontrado" });

      // 2. Verificar se já fez check-in
      if (guest.checked_in) {
        return callback({ message: "Convidado já realizou check-in" });
      }

      // 3. Buscar evento
      db.get(
        "SELECT * FROM events WHERE id = ?",
        [guest.event_id],
        (err, event) => {
          if (err) return callback(err);
          if (!event) return callback({ message: "Evento não encontrado" });

          // 4. Contar presentes
          db.get(
            `
            SELECT COUNT(*) as total
            FROM guests
            WHERE event_id = ?
              AND checked_in = 1
            `,
            [event.id],
            (err, result) => {
              if (err) return callback(err);

              const isExtra = result.total >= event.max_capacity;

              // 5. Atualizar check-in
              db.run(
                `
                UPDATE guests
                SET checked_in = 1,
                    is_extra = ?,
                    checkin_at = CURRENT_TIMESTAMP
                WHERE id = ?
                `,
                [isExtra ? 1 : 0, guestId],
                function (err) {
                  if (err) return callback(err);

                  callback(null, {
                    message: isExtra
                      ? "Check-in realizado (EXCEDENTE)"
                      : "Check-in realizado com sucesso",
                    is_extra: isExtra
                  });
                }
              );
            }
          );
        }
      );
    }
  );
}

module.exports = { checkinGuestService };
