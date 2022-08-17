const {
    fireStore,
} = require('../config/firebase');
const fs = fireStore;
module.exports = {
    // firestore clould database
    getAllVendors: async (req, res) => {
        try {
            const vendors = await fs.collection('vendors').get();
            const data = vendors.docs.map(doc => {
                return {
                    id: doc.id,
                    ...doc.data()
                }
            });
            res.status(200).json({
                message: "Vendor retrived successfully",
                Request: {
                    method: "GET",
                    url: `http://localhost:3000/vendors`
                },
                Response: data
            });
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }

    },
    getVendorById: async (req, res) => {
        try {
            const vendor = await fs.collection('vendors').doc(req.params.id).get();
            res.status(200).json({
                message: 'Vendor retrived successfully',
                Request: {
                    method: 'GET',
                    url: `http://localhost:3000/vendors/${vendor.id}`
                },
                Response: {
                    id: vendor.id,
                    ...vendor.data()
                }
            });
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }

    },
    createVendor: async (req, res) => {
        try {
            const {
                name,
                address,
                phone
            } = req.body;
            const vendor = await fs.collection('vendors').add({
                name,
                address,
                phone,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            res.status(200).json({
                id: vendor.id,
                ...req.body
            });
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    },
    updateVendor: async (req, res) => {
        try {
            const {
                name,
                address,
                phone
            } = req.body;
            const vendor = await fs.collection('vendors').doc(req.params.id).update({
                name,
                address,
                phone,
                updatedAt: new Date()
            });
            res.status(200).json({
                id: vendor.id,
                ...vendor.data(),
            });
        } catch (error) {

        }


    },
    deleteVendor: async (req, res) => {
        try {
            const vendor = await fs.collection('vendors').doc(req.params.id).delete();
            res.status(200).json({
                id: vendor.id,
                ...vendor.data()
            });
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }


    },


}