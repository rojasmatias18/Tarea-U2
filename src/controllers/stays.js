const stays = require('../services/stays');
exports.reserve = async (req,res) => res.status(201).json(await stays.reserve(req.user.id, req.body));
exports.review = async (req,res) => res.status(201).json(await stays.review(req.user.id, req.body));
const records = require('../services/history');
exports.history = async (req,res) => res.json(await records.history(req.user.id));
exports.opinions = async (req,res) => res.json(await records.opinions(req.params.id));
exports.remove = async (req,res) => {
  await records.removeReservation(req.user.id, Number(req.params.id));
  res.sendStatus(204);
};
