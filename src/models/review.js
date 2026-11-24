const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: [true,'Falta la habitación'] },
  reservationId: { type: Number, unique: true, required: [true,'Falta la reserva'] },
  userId: { type: Number, required: [true,'Falta el huésped'] },
  guestName: { type: String, required: [true,'Falta el nombre del huésped'] },
  rating: { type: Number, required: [true,'Falta la puntuación'], min: [1,'La puntuación mínima es 1'], max: [5,'La puntuación máxima es 5'] },
  comment: { type: String, trim: true, required: [true,'Falta el comentario'], maxlength: [500,'Máximo 500 caracteres'] }
}, { timestamps: true });
schema.index({ room: 1, createdAt: -1 });
module.exports = mongoose.model('StayReview',schema);
