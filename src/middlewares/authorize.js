const jwt = require("jsonwebtoken");

function authorize(allowedRoles = []) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Token não informado" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // decoded = { id, role, iat, exp }

      if (
        allowedRoles.length > 0 &&
        !allowedRoles.includes(decoded.role)
      ) {
        return res.status(403).json({ error: "Acesso negado" });
      }

      req.user = decoded;
      next();
    } catch {
      return res.status(401).json({ error: "Sessão expirada" });
    }
  };
}

module.exports = authorize;

