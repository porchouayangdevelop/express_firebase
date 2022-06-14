const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {
    fireStore
} = require('../config/firebase');

const db = fireStore;
require('dotenv').config();
module.exports = {
    async register(req, res) {
        const {
            username,
            password,
            email,
            role
        } = req.body;
        const user = await db.collection('users').where('email', '==', email).get();
        if (user.empty) {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
            const newUser = await db.collection('users').add({
                username: username,
                password: hash,
                email: email,
                role: role
            });
            const user = await db.collection('users').doc(newUser.id).get();
            const token = jwt.sign({
                id: user.id,
                username: user.data().username,
                email: user.data().email,
                role: user.data().role
            }, process.env.JWT_SECRET, {
                expiresIn: '1h'
            });
            return res.status(201).json({
                message: 'User created successfully',
                token,
                user: {
                    id: user.id,
                    username: user.data().username,
                    email: user.data().email,
                    role: user.data().role
                }
            });
        } else {
            return res.status(400).json({
                message: 'User already exists'
            });
        }
    },
    async login(req, res) {
        const {
            email,
            password
        } = req.body;
        const user = await db.collection('users').where('email', '==', email).get();
        if (!user.empty) {
            const data = user.docs[0];
            const isMatch = await bcrypt.compare(password, data.data().password);
            if (isMatch) {
                const token = jwt.sign({
                    id: data.id,
                    username: data.data().username,
                    email: data.data().email,
                    role: data.data().role
                }, process.env.JWT_SECRET, {
                    expiresIn: '1h'
                });
                return res.status(200).json({
                    message: 'User logged in successfully',
                    token,
                    user: {
                        id: data.id,
                        username: data.data().username,
                        email: data.data().email,
                        role: data.data().role
                    }
                });
            } else {
                return res.status(400).json({
                    message: 'Invalid password'
                });
            }
        } else {
            return res.status(400).json({
                message: 'User not found'
            });
        }
    },
    async getAll(req, res) {
        const users = await db.collection('users').get();
        const usersList = users.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data()
            }
        });
        return res.status(200).json(usersList);
    },
    async getById(req, res) {
        const user = await db.collection('users').doc(req.params.id).get();
        if (user.exists) {
            return res.status(200).json(user.data());
        } else {
            return res.status(400).json({
                message: 'User not found'
            });
        }
    },
    async update(req, res) {
        const user = await db.collection('users').doc(req.params.id).get();
        if (user.exists) {
            const {
                username,
                password,
                email,
                role
            } = req.body;
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
            await db.collection('users').doc(req.params.id).update({
                username,
                password: hash,
                email,
                role
            });
            return res.status(200).json({
                message: 'User updated successfully'
            });
        } else {
            return res.status(400).json({
                message: 'User not found'
            });
        }

    },
    async deleteUser(req, res) {
        const user = await db.collection('users').doc(req.params.id).get();
        if (user.exists) {
            await db.collection('users').doc(req.params.id).delete();
            return res.status(200).json({
                message: 'User deleted successfully'
            });
        } else {
            return res.status(400).json({
                message: 'User not found'
            });
        }
    }


}