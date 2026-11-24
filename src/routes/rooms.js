const router = require('express').Router();
const { auth, admin } = require('../middlewares/auth');
const rooms = require('../controllers/rooms');
router.route('/').get(rooms.list).post(auth,admin,rooms.create);
router.route('/:id').get(rooms.get).put(auth,admin,rooms.update).delete(auth,admin,rooms.remove);
module.exports = router;
