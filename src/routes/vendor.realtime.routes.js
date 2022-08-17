const {
    Router
} = require('express');
const {
    createVendor,
    deleteVendor,
    getVendor,
    getVendors,
    updateVendor
} = require('../controllers/vendor.realtime');

const router = Router();

router.route('/').post(createVendor).get(getVendors);
router.route('/:id').get(getVendor).put(updateVendor).delete(deleteVendor);

module.exports = router;