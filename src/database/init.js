const fs = require("fs");
const path = require("path");
const db = require("./connection");

// Caminho do arquivo schema.sql
const schemaPath = path.resolve(__dirname, "schema.sql");

// Lê o conteúdo do schema.sql
const schema = fs.readFileSync(schemaPath, "utf8");

// Executa o SQL para criar as tabelas
db.exec(schema, (err) => {
  if (err) {
    console.error("Erro ao inicializar o banco:", err.message);
  } else {
    console.log("Banco inicializado com sucesso");
  }
});
