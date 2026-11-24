require('dotenv').config();
const app = require('./app');
const prisma = require('./db/prisma');

async function start() {
  if (!process.env.JWT_SECRET) throw new Error('Configura JWT_SECRET');
  await prisma.$connect();
  await require("./db/mongo")();
  await require("./models/room").init();
  await require("./models/review").init();
  app.listen(process.env.PORT || 3002, () => console.log('API del hotel lista'));
}
start().catch(err => { console.error(err.message); process.exit(1); });
