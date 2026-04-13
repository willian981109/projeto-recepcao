import sqlite3 from "sqlite3";
sqlite3.verbose();
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// log pra conferir o banco usado
console.log("USANDO BANCO:", path.join(__dirname, "database.sqlite"));

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

export default db;
