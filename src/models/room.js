const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  number: { type: String, required: [true, 'Falta el número'], unique: true, match: [/^[A-Z]-\d{3}$/, 'Usa un número como A-101'] },
  type: { type: String, required: [true, 'Falta el tipo'], enum: { values: ['simple','doble','suite'], message: 'Tipo de habitación inválido' } },
  capacity: { type: Number, required: [true, 'Falta la capacidad'], min: [1,'Capacidad mínima de una persona'], max: [8,'Capacidad máxima de ocho personas'], cast: 'Capacidad inválida', validate: [Number.isInteger,'La capacidad debe ser entera'] },
  services: { type: [String], default: [], validate: {
    validator: list => list.length <= 20 && list.every(Boolean) && new Set(list).size === list.length,
    message: 'Ingresa hasta 20 servicios distintos y sin textos vacíos'
  }}
}, { toJSON: { virtuals: true, versionKey: false }, id: false });
schema.pre('validate', function () {
  if (this.number) this.number = this.number.trim().toUpperCase();
  if (Array.isArray(this.services)) this.services = this.services.map(s => s?.trim().toLowerCase());
});
schema.virtual('displayName').get(function () {
  return this.number && this.type ? [this.number, this.type].join(' · ') : undefined;
});
module.exports = mongoose.model('Room', schema);
