const router = require('express').Router();
const {
    payment,
    getAll,
    getPayment,
    Update,
    DeletePayment
} = require('../controllers/payment.controller');
const route = (app) => {

    router.route('/').get(getAll).post(payment);
    router.route('/:id').get(getPayment).put(Update).delete(DeletePayment);
    return app.use('/payment', router);
}

module.exports = route;