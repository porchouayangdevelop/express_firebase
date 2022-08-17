const {
    realtimeDB
} = require('../config/firebase');
const db = realtimeDB;
module.exports = {
    payment: async (req, res) => {
        try {
            const {
                title,
                description,
                total,
                person
            } = req.body;
            await db.ref('payment').push({
                    title: title,
                    description: description,
                    total: total,
                    person: person,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                })
                .then(() => {
                    res.status(201).json({
                        message: 'Payment created successfully',
                        Request: {
                            method: 'POST',
                            url: `http://localhost:3000/payment`
                        },
                        Response: {
                            data: {
                                title: title,
                                description: description,
                                total: total,
                                person: person,

                            }
                        }
                    })
                })
                .catch((e) => {
                    res.status(500).json({
                        message: e.message
                    })
                })

        } catch (e) {
            res.status(500).send({
                message: 'Something went wrong...',
                err: e.message
            })
        }

    },

    getAll: async (req, res) => {
        try {
            const payment = await db.ref('payment').once('value');
            const data = payment.val();
            if (data) {
                const list = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));
                res.status(200).json({
                    message: 'payment retrieved successfully',
                    Request: {
                        method: 'GET',
                        url: `http://localhost:3000/payment`
                    },
                    Response: {
                        data: list
                    }
                })
            }

        } catch (e) {
            res.status(500).send({
                message: e.message
            })
        }
    },

    getPayment: async (req, res) => {
        try {
            const {
                id
            } = req.params;
            const payment = await db.ref(`payment/${id}`).once('value');
            if (payment.val()) {
                res.status(200).json({
                    message: 'payment retrieved successfully',
                    Request: {
                        method: 'GET',
                        url: `http://localhost:3000/payment/${id}`
                    },
                    Response: payment.val(),
                })
            }
        } catch (e) {
            res.status(500).send({
                message: e.message
            });
        }
    },

    Update: async (req, res) => {
        try {
            const {
                id
            } = req.params;
            const {
                title,
                description,
                total,
                person
            } = req.body;
            await db.ref(`payment/${id}`).update({
                    title: title,
                    description: description,
                    total: total,
                    person: person,
                    updatedAt: new Date().toISOString()
                })
                .then(() => {
                    res.status(200).json({
                        message: 'payment updated successful',
                        Request: {
                            method: 'PUT',
                            url: `http://localhost:3000/payment/${id}`,
                        },
                        Response: {
                            id: id,
                            title: title,
                            description: description,
                            total: total,
                            person: person,
                        }
                    });
                })
                .catch((e) => {
                    res.status(404).json({
                        message: 'payment updated fail',
                        eror: e.message
                    })
                })
        } catch (e) {
            res.status(500).send({
                message: e.message
            });
        }
    },

    DeletePayment: async (req, res) => {
        try {
            const {
                id
            } = req.params;
            await db.ref(`payment`).child(id).remove()
                .then(result => {
                    res.status(200).json({
                        message: 'Payment deleted successful',
                        id: result.id
                    })
                })
                .catch((e) => {
                    res.status(404).json({
                        message: 'Payment deleted fail',
                    })
                })
        } catch (e) {
            res.status(500).send({
                message: 'Something went wrong...',
                error: e.message
            })
        }
    }


}