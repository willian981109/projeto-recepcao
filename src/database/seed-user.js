import db from './connection.js';

db.run(
  "INSERT INTO users (username, password) VALUES (?, ?)",
  ["recepcao", "123456"],
  function (err) {
    if (err) {
      console.error("Erro ao inserir usuário:", err.message);
    } else {
      console.log("Usuário criado com sucesso!");
    }

    db.close();
  }
);
