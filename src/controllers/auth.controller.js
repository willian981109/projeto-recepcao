import jwt from 'jsonwebtoken';
import  loginService   from '../services/auth.service.js';

function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      error: "Usuário e senha são obrigatórios"
    });
  }

  loginService(username, password, (err, result) => {
    if (err) {
      return res.status(401).json({ error: err });
    }

    const { user } = result;

    // 🔐 TOKEN (8 HORAS)
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      token,
      user
    });
  });
}

export default login;
