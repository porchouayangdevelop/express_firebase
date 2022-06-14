const {
    realtimeDB
} = require('../config/firebase');

const db = realtimeDB;


const createVendor = (req, res) => {
    try {
        const {
            name,
            phone,
            address: {
                village,
                district,
                province
            },
            location: {
                lat,
                lng
            }
        } = req.body;
        const vendor = {
            name: name,
            phone: phone,
            address: {
                village: village,
                district: district,
                province: province,
            },
            location: {
                lat: lat,
                lng: lng
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
        db.ref('vendors').push(vendor);
        res.status(200).json({
            message: 'Vendor created successfully',
            data: vendor
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

const getVendor = (req, res) => {
    try {
        const {
            id
        } = req.params;
        db.ref(`vendors/${id}`).once('value', (snapshot) => {
            const vendor = snapshot.val();
            res.status(200).json({
                message: 'Vendor fetched successfully',
                data: vendor
            });
        }).catch((error) => {
            res.status(500).json({
                message: error.message
            });
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

const getVendors = async (req, res) => {
    try {
        const vendors = await db.ref('vendors').once('value');
        const vendorsData = vendors.val();
        if (vendorsData) {
            const vendorsList = Object.keys(vendorsData).map(key => ({
                id: key,
                ...vendorsData[key]
            }));
            res.status(200).json({
                message: 'Vendors listed successfully',
                data: vendorsList
            });
        } else {
            res.status(200).json({
                message: 'No vendors found'
            });
        }

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

const updateVendor = (req, res) => {
    try {
        const {
            id
        } = req.params;
        const {
            name,
            phone,
            address: {
                village,
                district,
                province
            },
            location: {
                lat,
                lng
            }
        } = req.body;
        const vendor = {
            name: name,
            phone: phone,
            address: {
                village: village,
                district: district,
                province: province,
            },
            location: {
                lat: lat,
                lng: lng
            },
            updatedAt: new Date().toISOString()
        }
        db.ref(`vendors/${id}`).update(vendor);
        res.status(200).json({
            message: 'Vendor updated successfully',
            data: vendor
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

const deleteVendor = (req, res) => {
    try {
        const {
            id
        } = req.params;
        db.ref(`vendors/${id}`).remove();
        res.status(200).json({
            message: 'Vendor deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

module.exports = {
    createVendor,
    getVendor,
    getVendors,
    updateVendor,
    deleteVendor
}