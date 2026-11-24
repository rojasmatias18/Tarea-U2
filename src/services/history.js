const mongoose = require('mongoose');
const prisma = require('../db/prisma');
const Room = require('../models/room');
const Review = require('../models/review');
const { get } = require('./rooms');
const { owned } = require('./stays');
const withRoomLock = require('./bookingLock');

async function history(userId) {
  const stays = await prisma.reservation.findMany({ where: { userId }, orderBy: { checkIn: 'desc' } });
  const ids = [...new Set(stays.map(s => s.roomId).filter(Boolean))];
  const rooms = await Room.find({ _id: { $in: ids } }).select('number type capacity').lean();
  const byId = new Map(rooms.map(r => [String(r._id),r]));
  return stays.map(s => ({ ...s, room: byId.get(s.roomId) || null }));
}
async function opinions(id) {
  await get(id);
  const room = new mongoose.Types.ObjectId(id);
  const reviews = await Review.find({ room }).populate('room','number type').sort({ createdAt: -1 });
  const [summary] = await Review.aggregate([{ $match: { room } }, { $group: { _id: null, total: { $sum: 1 }, average: { $avg: '$rating' } } }]);
  return { reviews, total: summary?.total || 0, average: summary?.average ?? null };
}
async function removeReservation(userId, id) {
  const first = await owned(prisma,id,userId);
  return withRoomLock(first.roomId || 'sin-habitacion',async tx => {
    await owned(tx,id,userId);
    await Review.deleteMany({ reservationId: id });
    await tx.reservation.delete({ where: { id } });
  });
}
module.exports = { history, opinions, removeReservation };
