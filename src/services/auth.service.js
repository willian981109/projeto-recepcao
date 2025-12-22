const db = require("../database/connection");

function loginService(username, password, callback) {
  const query = `
    SELECT id, username
    FROM users
    WHERE username = ? AND password = ?
  `;

  db.get(query, [username, password], (err, user) => {
    if (err) return callback(err);
    if (!user) return callback({ message: "Usuário ou senha inválidos" });

    callback(null, {
      message: "Login realizado com sucesso",
      user
    });
  });
}

module.exports = { loginService };
