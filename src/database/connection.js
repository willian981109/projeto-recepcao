const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// log para conferir o banco usado
console.log("USANDO BANCO:", path.join(__dirname, "database.sqlite"));

// caminho do banco
const db = new sqlite3.Database(
  path.join(__dirname, "database.sqlite"),
  (err) => {
    if (err) {
      console.error("Erro ao conectar no banco:", err.message);
    } else {
      console.log("Banco SQLite conectado com sucesso");
    }
  }
);

module.exports = db;
