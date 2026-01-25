const jwt = require("jsonwebtoken");

/**
 * Middleware de autorização por JWT + role
 * @param {Array} allowedRoles - perfis permitidos na rota
 */
function authorize(allowedRoles = []) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    // 🔐 Token não enviado
    if (!authHeader) {
      return res.status(401).json({
        error: "Token não informado"
      });
    }

    // Esperado: "Bearer TOKEN"
    const [type, token] = authHeader.split(" ");

    if (type !== "Bearer" || !token) {
      return res.status(401).json({
        error: "Formato de token inválido"
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // decoded = { id, role, iat, exp }

      // 🔒 Validação de perfil (role)
      if (
        allowedRoles.length > 0 &&
        !allowedRoles.includes(decoded.role)
      ) {
        return res.status(403).json({
          error: "Acesso negado"
        });
      }

      // Usuário autenticado disponível nas rotas
      req.user = decoded;
      next();

    } catch (err) {
      return res.status(401).json({
        error: "Sessão expirada"
      });
    }
  };
}

module.exports = authorize;


