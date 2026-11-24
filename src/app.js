const express = require('express');
const app = express();
app.use(express.json());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api', require('./routes/stays'));
app.use((err, req, res, next) => {
  if (err.code === 'P2002' || err.code === 11000) return res.status(409).json({ error: 'Registro duplicado' });
  if (err.name === 'ValidationError') return res.status(400).json({ error: Object.values(err.errors).map(e => e.message).join('. ') });
  if (err.name === 'CastError') return res.status(400).json({ error: 'Valor inválido' });
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'JSON inválido' });
  if (err.status) return res.status(err.status).json({ error: err.message });
  if (['P1001','P1002','P1017','P2024','P2028','ECONNREFUSED'].includes(err.code) || /Mongo(Network|ServerSelection)|MongooseServerSelection/.test(err.name)) {
    return res.status(503).json({ error: 'Base de datos temporalmente inaccesible' });
  }
  console.error(err.message);
  res.status(500).json({ error: 'Error interno' });
});
module.exports = app;
