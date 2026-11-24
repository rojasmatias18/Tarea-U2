const Room = require('../models/room');
const Review = require('../models/review');
const prisma = require('../db/prisma');
const withRoomLock = require('./bookingLock');
const { fail, objectId } = require('./check');

function date(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) fail(400,'Usa fechas AAAA-MM-DD');
  const day = new Date(value + 'T00:00:00Z');
  if (!Number.isFinite(day.getTime()) || day.toISOString().slice(0,10) !== value) fail(400,'Fecha inexistente');
  return day;
}
async function reserve(userId, body = {}) {
  const roomId = objectId(body.roomId);
  const checkIn = date(body.checkIn);
  const checkOut = date(body.checkOut);
  if (checkOut <= checkIn) fail(400,'La salida debe ser posterior a la entrada');
  return withRoomLock(roomId, async tx => {
    if (!await Room.exists({ _id: roomId })) fail(404,'Habitación inexistente');
    const overlap = await tx.reservation.findFirst({ where: { roomId, checkIn: { lt: checkOut }, checkOut: { gt: checkIn } } });
    if (overlap) fail(409,'Habitación ocupada en esas fechas');
    return tx.reservation.create({ data: { userId, roomId, checkIn, checkOut } });
  });
}
async function owned(db, id, userId) {
  if (!Number.isSafeInteger(id) || id < 1 || id > 2147483647) fail(400,'ID de reserva inválido');
  const stay = await db.reservation.findUnique({ where: { id }, include: { user: { select: { name: true } } } });
  if (!stay) fail(404,'Reserva inexistente');
  if (stay.userId !== userId) fail(403,'La reserva pertenece a otro huésped');
  return stay;
}

async function review(userId, body = {}) {
  const { reservationId, rating, comment } = body;
  if (!Number.isInteger(rating) || rating < 1 || rating > 5 || typeof comment !== 'string') fail(400,'Revisa puntuación y comentario');
  const first = await owned(prisma,reservationId,userId);
  if (!first.roomId) fail(409,'Reserva sin habitación asociada');
  return withRoomLock(first.roomId, async tx => {
    const stay = await owned(tx,reservationId,userId);
    if (stay.checkOut > new Date()) fail(409,'La estadía aún no ha terminado');
    return Review.create({ room: stay.roomId, reservationId, rating, comment, userId, guestName: stay.user.name });
  });
}
module.exports = { reserve, review, owned };
