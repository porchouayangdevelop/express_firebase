const {
    createVendor,
    getAllVendors,
    getVendorById,
    updateVendor,
    deleteVendor,
} = require('../controllers/vendor.controller');
const {
    Router
} = require('express');
const router = Router();

router.route('/').post(createVendor).get(getAllVendors);
router.route('/:id').get(getVendorById).put(updateVendor).delete(deleteVendor);

module.exports = router;