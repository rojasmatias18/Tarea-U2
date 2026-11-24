const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const token = req.get('Authorization')?.match(/^Bearer (\S+)$/i)?.[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    next();
  } catch {
    res.status(401).json({ error: 'Inicia sesión con un token válido' });
  }
}

function admin(req, res, next) {
  if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Se requiere el rol de encargado' });
  next();
}

module.exports = { auth, admin };
