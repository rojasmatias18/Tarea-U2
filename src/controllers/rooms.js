const rooms = require('../services/rooms');
exports.list = async (req,res) => res.json(await rooms.list(req.query));
exports.get = async (req,res) => res.json(await rooms.get(req.params.id));
exports.create = async (req,res) => res.status(201).json(await rooms.create(req.body));
exports.update = async (req,res) => res.json(await rooms.update(req.params.id,req.body));
exports.remove = async (req,res) => { await rooms.remove(req.params.id); res.sendStatus(204); };
