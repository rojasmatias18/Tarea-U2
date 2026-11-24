const router = require('express').Router();
const { registerUser, loginUser } = require('../services/authService');

router.post('/register', async (req, res) => {
  const { email, password, name } = req.body || {};
  if (typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email) ||
      typeof password !== 'string' || password.length < 8 || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Ingresa nombre, correo y contraseña de al menos ocho caracteres' });
  }
  const user = await registerUser(email.trim().toLowerCase(), password, name.trim());
  res.status(201).json({ id: user.id, name: user.name });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Ingresa correo y contraseña' });
  }
  res.json({ token: await loginUser(email.trim().toLowerCase(), password) });
});
module.exports = router;
