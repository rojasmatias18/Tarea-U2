const mongoose = require('mongoose');

function fail(status, message) { throw Object.assign(new Error(message), { status }); }
function objectId(value) {
  if (typeof value !== 'string' || !/^[a-f\d]{24}$/i.test(value) || !mongoose.isValidObjectId(value)) fail(400,'Identificador de habitación inválido');
  return value.toLowerCase();
}
module.exports = { fail, objectId };
