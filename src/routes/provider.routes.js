const {
    Router
} = require('express');

const {
    register,
    login,
    deleted,
    update,
    list,
    get
} = require('../controllers/provider.controller');

const router = Router();

router.route('/').get(list).post(register);
router.route('/login').post(login);
router.route('/:id').put(update).delete(deleted).get(get);

module.exports = router;