const { loginService } = require("../services/auth.service");

function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      error: "Usuário e senha são obrigatórios"
    });
  }

  loginService(username, password, (err, result) => {
    if (err) {
      return res.status(401).json({ error: err.message || err });
    }

    res.json(result);
  });
}

module.exports = { login };
