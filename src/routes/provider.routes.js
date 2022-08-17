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
const Authenticate = require('../middlewares/Authorization');
const router = Router();

router.route('/').get(list).post(register);
router.route('/login').post(login);
router.route('/:id').put(update).get(get);
router.delete('/:id', Authenticate, deleted);

module.exports = router;