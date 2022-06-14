const router = require('express').Router();

const {
    register,
    login,
    getAll,
    getById,
    update,
    deleteUser
} = require('../controllers/user.controller');


router.route('').get(getAll).post(register);
router.post('/login', login);
router.route('/:id').get(getById).put(update).delete(deleteUser);

module.exports = router;