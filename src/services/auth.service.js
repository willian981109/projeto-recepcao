import db from '../database/connection.js';

function loginService(username, password, callback) {
  db.get(
    `
    SELECT id, username, role
    FROM users
    WHERE username = ? AND password = ?
    `,
    [username, password],
    (err, user) => {
      if (err) {
        return callback("Erro ao acessar o banco de dados");
      }

      if (!user) {
        return callback("Usuário ou senha inválidos");
      }

      callback(null, {
        success: true,
        user
      });
    }
  );
}

export default loginService;
