const prisma = require('../db/prisma');
// Todas las operaciones que cambian relaciones usan la misma llave de habitación.
module.exports = function withRoomLock(id, operation) {
  return prisma.$transaction(async tx => {
    await tx.$queryRaw`SELECT 1 AS locked FROM pg_advisory_xact_lock(hashtextextended(${id}::text, 0))`;
    return operation(tx);
  }, { timeout: 20000 });
};
