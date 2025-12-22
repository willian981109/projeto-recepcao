const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Caminho do arquivo do banco
const dbPath = path.resolve(__dirname, "database.sqlite");

// Cria a conexão com o banco
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Erro ao conectar no banco:", err.message);
  } else {
    console.log("Banco SQLite conectado com sucesso");
  }
});

module.exports = db;
