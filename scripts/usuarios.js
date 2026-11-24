require('dotenv').config();
const bcrypt = require('bcryptjs');
const prisma = require('../src/db/prisma');

async function main() {
  if (!process.env.DEMO_PASSWORD || process.env.DEMO_PASSWORD.length < 8) throw new Error('Define DEMO_PASSWORD (mínimo 8 caracteres)');
  const password = await bcrypt.hash(process.env.DEMO_PASSWORD, 10);
  for (const [name, email, role] of [
    ['Recepción', 'admin@hotel.test', 'ADMIN'],
    ['Ana', 'ana@hotel.test', 'USER'],
    ['Luis', 'luis@hotel.test', 'USER']
  ]) {
    await prisma.user.upsert({ where: { email }, create: { name, email, password, role }, update: { password, role } });
  }
  console.log('Tres usuarios de demostración disponibles');
}
main().catch(err => { console.error(err.message); process.exitCode = 1; }).finally(() => prisma.$disconnect());
