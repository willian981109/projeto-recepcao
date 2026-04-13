import normalizarNome from '../utils/normalizarNome.js';
import db from '../database/connection.js';
import fs from 'fs';
import csv from 'csv-parser';

// ===============================
// LISTAR CONVIDADOS POR EVENTO
// ===============================
function listGuests(req, res) {
  const { eventId } = req.params;

  db.all(
    `
    SELECT *
    FROM guests
    WHERE event_id = ?
      AND origem_lista = 1
    ORDER BY created_at DESC
    `,
    [Number(eventId)],
    (err, rows) => {
      if (err) {
        console.error("LIST GUESTS ERRO:", err);
        return res.status(500).json({ error: err.message });
      }

      res.json(rows);
    }
  );
}

// ===============================
// CRIAR CONVIDADO MANUAL (DA LISTA)
// ===============================
function createGuest(req, res) {
  const { eventId } = req.params;
  const { name, document, has_companion, children_count } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Nome do convidado é obrigatório" });
  }

  const nomeNormalizado = normalizarNome(name);

  db.run(
    `
    INSERT INTO guests (
      event_id,
      name,
      nome_normalizado,
      document,
      has_companion,
      children_count,
      origem_lista
    )
    VALUES (?, ?, ?, ?, ?, ?, 1)
    `,
    [
      Number(eventId),
      name,
      nomeNormalizado,
      document || null,
      has_companion ? 1 : 0,
      Number(children_count) || 0
    ],
    function (err) {
      if (err) {
        console.error("CREATE GUEST ERRO:", err);
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
        message: "Convidado criado com sucesso",
        guest_id: this.lastID
      });
    }
  );
}

// ===============================
// CHECK-IN PADRÃO (CONVIDADO DA LISTA)
// ===============================
function checkin(req, res) {
  const { nome, evento_id } = req.body;
  const eventId = Number(evento_id);

  if (!nome || !eventId) {
    return res.status(400).json({
      error: "Nome e evento são obrigatórios"
    });
  }

  const nomeNormalizado = normalizarNome(nome);

  db.serialize(() => {
    // 1️⃣ buscar convidado DA LISTA
    db.get(
      `
      SELECT id
      FROM guests
      WHERE nome_normalizado = ?
        AND event_id = ?
        AND origem_lista = 1
      `,
      [nomeNormalizado, eventId],
      (err, guest) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        if (!guest) {
          return res.json({
            success: false,
            type: "NOT_IN_LIST"
          });
        }

        // 2️⃣ buscar total atual + capacidade
        db.get(
          `
          SELECT 
            (SELECT COUNT(*) FROM event_entries WHERE event_id = ?) AS total,
            (SELECT max_capacity FROM events WHERE id = ?) AS capacidade
          `,
          [eventId, eventId],
          (err, info) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }

            const excedente = info.total >= info.capacidade ? 1 : 0;

            // 3️⃣ registrar entrada
            db.run(
              `
              INSERT INTO event_entries (event_id, guest_id, fora_lista, excedente)
              VALUES (?, ?, 0, ?)
              `,
              [eventId, guest.id, excedente],
              (err) => {
                if (err) {
                  return res.status(500).json({ error: err.message });
                }

                res.json({
                  success: true,
                  type: "CHECKED_OK",
                  excedente: Boolean(excedente)
                });
              }
            );
          }
        );
      }
    );
  });
}

// ===============================
// CHECK-IN FORA DA LISTA (OVERRIDE)
// ===============================
function checkinOverride(req, res) {
  const { nome, evento_id } = req.body;
  const eventId = Number(evento_id);
  const nomeNormalizado = normalizarNome(nome);

  db.serialize(() => {
    // 1️⃣ criar convidado FORA DA LISTA
    db.run(
      `
      INSERT INTO guests (event_id, name, nome_normalizado, origem_lista)
      VALUES (?, ?, ?, 0)
      `,
      [eventId, nome, nomeNormalizado],
      function () {
        const guestId = this.lastID;

        // 2️⃣ buscar total + capacidade
        db.get(
          `
          SELECT 
            (SELECT COUNT(*) FROM event_entries WHERE event_id = ?) AS total,
            (SELECT max_capacity FROM events WHERE id = ?) AS capacidade
          `,
          [eventId, eventId],
          (err, info) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }

            const excedente = info.total >= info.capacidade ? 1 : 0;

            // 3️⃣ registrar entrada
            db.run(
              `
              INSERT INTO event_entries (event_id, guest_id, fora_lista, excedente)
              VALUES (?, ?, 1, ?)
              `,
              [eventId, guestId, excedente],
              () => {
                res.json({
                  success: true,
                  type: "CHECKED_OVERRIDE",
                  excedente: Boolean(excedente)
                });
              }
            );
          }
        );
      }
    );
  });
}

// ===============================
// TOTAL DE ENTRADAS
// ===============================
function totalGuestsByEvent(req, res) {
  const { eventId } = req.params;

  db.get(
    `
    SELECT COUNT(*) AS total
    FROM event_entries
    WHERE event_id = ?
    `,
    [Number(eventId)],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({
        event_id: Number(eventId),
        total: row.total
      });
    }
  );
}

// ===============================
// IMPORTAR CONVIDADOS CSV (DA LISTA)
// ===============================
function importGuests(req, res) {
  const { eventId } = req.params;

  if (!req.file) {
    return res.status(400).json({ error: "Arquivo CSV não enviado" });
  }

  const filePath = req.file.path;
  const guests = [];

  fs.createReadStream(filePath)
    .pipe(csv({ headers: false }))
    .on("data", (row) => {
      const nome = Object.values(row)[0];
      if (nome) {
        guests.push({
          event_id: Number(eventId),
          name: nome.trim(),
          nome_normalizado: normalizarNome(nome)
        });
      }
    })
    .on("end", () => {
      db.serialize(() => {
        const stmt = db.prepare(
          `
          INSERT INTO guests (event_id, name, nome_normalizado, origem_lista)
          VALUES (?, ?, ?, 1)
          `
        );

        guests.forEach(g => {
          stmt.run(g.event_id, g.name, g.nome_normalizado);
        });

        stmt.finalize(() => {
          fs.unlinkSync(filePath);
          res.json({
            message: "Convidados importados com sucesso",
            total: guests.length
          });
        });
      });
    });
}

export {
  listGuests,
  createGuest,
  checkin,
  checkinOverride,
  totalGuestsByEvent,
  importGuests
};
