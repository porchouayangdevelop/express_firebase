const jwt = require('jsonwebtoken');

require('dotenv').config();

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.provider = decode;
        next();
    } catch (e) {
        res.status(401).send('Not Authorization');
    }
}