const {
    realtimeDB
} = require('../config/firebase');
const {
    sign,
    decode,
    verify
} = require('jsonwebtoken');

const Authenticate = require('../middlewares/Authorization');
const bcrypt = require('bcrypt');
const {
    response
} = require('express');
require('dotenv').config();
const db = realtimeDB;

module.exports = {
    async register(req, res) {
        const {
            firstname,
            lastname,
            phone,
            email,
            username,
            password,
            role,
            vendor
        } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const provider = {
            firstname: firstname,
            lastname: lastname,
            phone: phone,
            email: email,
            username: username,
            password: hash,
            role: role,
            vendor: vendor,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        const oldProvider = await db.ref('providers').orderByChild('username').equalTo(username).once('value');
        if (oldProvider.val()) {
            return res.status(400).json({
                message: 'Username already exists'
            });
        }
        const newProvider = await db.ref('providers').push(provider);
        const token = sign({
            id: newProvider.key,
            username,
            role
        }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });
        return res.status(201).json({
            message: 'Provider registered successfully',
            Request: {
                method: 'POST',
                url: `http://localhost:3000/providers`,
            },
            Response: {
                token,
                id: newProvider.key,
                firstname: firstname,
                lastname: lastname,
                phone: phone,
                email: email,
                username: username,
                password: password,
                role: role,
                vendor: vendor
            }
        });
    },
    async login(req, res) {
        try {
            const {
                username,
                password
            } = req.body;
            if (!username || !password) {
                return res.status(400).json({
                    message: 'Username or password is missing'
                });
            }
            const provider = await db.ref('providers').orderByChild('username').equalTo(username).once('value');
            const providerData = provider.val();
            if (providerData) {
                const list = Object.values(providerData);
                const provider = list[0];
                const isMatch = await bcrypt.compare(password, provider.password);
                if (isMatch) {
                    const token = sign({
                        id: provider.id,
                        username: provider.username,
                        role: provider.role
                    }, process.env.JWT_SECRET, {
                        expiresIn: '1h'
                    });
                    return res.status(200).json({
                        message: 'Login successful',

                        Request: {
                            method: 'POST',
                            url: `http://localhost:3000/providers/login`
                        },
                        Response: {
                            token,
                            provider: {
                                id: provider.id,
                                firstname: provider.firstname,
                                lastname: provider.lastname,
                                phone: provider.phone,
                                email: provider.email,
                                username: provider.username,
                                password: provider.password,
                                role: provider.role,
                                vendor: provider.vendor
                            }
                        }
                    });
                } else {
                    return res.status(400).json({
                        message: 'Password is incorrect'
                    });
                }
            } else {
                return res.status(400).json({
                    message: 'Username is incorrect'
                });
            }

        } catch (error) {
            return res.status(500).json({
                // message: 'Something went wrong',
                message: error.message
            });
        }
    },
    async list(req, res) {
        const providers = await db.ref('providers').once('value');
        const providersData = providers.val();
        if (providersData) {
            const providersList = Object.keys(providersData).map(key => ({
                id: key,
                ...providersData[key]
            }));
            res.status(200).json({
                message: 'Providers listed successfully',
                Request: {
                    'method': 'GET',
                    url: `http://localhost:3000/providers`
                },
                Response: providersList
            });
        } else {
            res.status(200).json({
                message: 'No providers found'
            });
        }
    },
    async get(req, res) {
        const {
            id
        } = req.params;
        const provider = await db.ref(`providers/${id}`).once('value');
        if (provider.val()) {
            res.status(200).json({
                message: 'Provider retrieved successfully',
                Request: {
                    'method': 'GET',
                    url: `http://localhost:3000/providers/${id}`
                },
                Response: provider.val(),

            });
        } else {
            res.status(404).json({
                message: 'Provider not found'
            });
        }
    },
    async update(req, res) {
        const {
            id
        } = req.params;
        const {
            username,
            password,
            email,
            phone,
            role
        } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const provider = {
            username,
            password: hash,
            email,
            phone,
            role
        };
        const oldProvider = await db.ref('providers').orderByChild('username').equalTo(username).once('value');
        if (oldProvider.val()) {
            return res.status(400).json({
                message: 'Username already exists'
            });
        }
        const newProvider = await db.ref('providers').child(id).update(provider);
        const token = sign({
            id,
            username,
            role
        }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });
        return res.status(200).json({
            message: 'Provider updated successfully',
            token,
            id,
            username,
            password,
            email,
            phone,
            role,
            newProvider
        });
    },
    async deleted(req, res) {
        const {
            id
        } = req.params;
        await db.ref(`providers/${id}`).remove()
            .then(response => {
                res.status(204).json({
                    message: 'Provider deleted'
                });
            })
            .catch(e => {
                res.status(404).json({
                    error: e.message
                });

            })
    },



}