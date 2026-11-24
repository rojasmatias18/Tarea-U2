const router = require('express').Router();
const { auth } = require('../middlewares/auth');
const stays = require('../controllers/stays');
router.post('/reservations',auth,stays.reserve);
router.post('/reviews',auth,stays.review);
router.get("/reservations/me",auth,stays.history);
router.get("/rooms/:id/reviews",stays.opinions);
router.delete("/reservations/:id",auth,stays.remove);
module.exports = router;
