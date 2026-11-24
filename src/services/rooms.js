const Review = require('../models/review');
const withRoomLock = require('./bookingLock');
const Room = require('../models/room');
const { fail, objectId } = require('./check');
const allowed = ['number','type','capacity','services'];

function attributes(body) {
  if (!body || !Object.keys(body).length || Object.keys(body).some(k => !allowed.includes(k))) fail(400,'Campos de habitación inválidos');
  if ('services' in body && (!Array.isArray(body.services) || body.services.some(s => typeof s !== 'string'))) fail(400,'Servicios debe ser un arreglo de textos');
  return body;
}
async function get(id) {
  const room = await Room.findById(objectId(id));
  if (!room) fail(404,'Habitación inexistente');
  return room;
}
async function list({ q = '', fields }) {
  if (typeof q !== 'string' || q.length > 100) fail(400,'Búsqueda inválida');
  const literal = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(literal,'i');
  const query = Room.find({ $or: [{ number: regex }, { type: regex }] }).sort({ number: 1 });
  if (fields !== undefined) {
    if (typeof fields !== 'string' || fields.split(',').some(k => !allowed.includes(k))) fail(400,'Proyección inválida');
    return query.select(fields.split(',').join(' ')).lean();
  }
  return query;
}
async function update(id, body) {
  const room = await get(id);
  room.set(attributes(body));
  return room.save();
}
async function remove(id) {
  const roomId = objectId(id);
  return withRoomLock(roomId, async tx => {
    const room = await get(roomId);
    if (await tx.reservation.count({ where: { roomId } })) fail(409,'La habitación tiene reservas');
    await Review.deleteMany({ room: roomId });
    await room.deleteOne();
  });
}
module.exports = { list, get, create: body => Room.create(attributes(body)), update, remove };
