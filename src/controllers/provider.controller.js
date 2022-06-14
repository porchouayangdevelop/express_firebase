const {
    realtimeDB
} = require('../config/firebase');
const {
    sign,
    decode,
    verify
} = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const db = realtimeDB;

module.exports = {
    async register(req, res) {
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
            token,
            id: newProvider.key,
            username,
            password,
            email,
            phone,
            role
        });
    },
    async login(req, res) {
        try {
            // res.json(provider.val());
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
            const isMatch = await bcrypt.compare(password, provider.val().password);
            if (isMatch) {
                res.json({
                    message: 'Login successful',
                });
            } else {
                return res.status(400).json({
                    message: 'Password is incorrect'
                });
            }

        } catch (error) {
            res.status(400).json({
                message: error.message
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
        await db.ref(`providers/${id}`).remove();
        res.status(204).json({
            message: 'Provider deleted'
        });
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
                data: providersList
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
                data: provider.val()
            });
        } else {
            res.status(404).json({
                message: 'Provider not found'
            });
        }
    }


}